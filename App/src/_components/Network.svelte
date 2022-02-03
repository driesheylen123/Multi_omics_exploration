<script>

    // Dependencies
    import { forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter } from 'd3-force';
    import { extent } from 'd3-array';
    import { select } from 'd3-selection';
    import { onMount } from 'svelte';
    import { simulationPause, radius, toHighlight, nodeFilter, edge_width } from "../stores";

    // $: console.log($nodeFilter);
    // External JS
    import { colorScale_edges } from '../_js/scales.js';
    import { zoomFunction, dragFunction, highlight, fade } from '../_js/functions';

    // Props
    export let nodes = [];
    export let links = [];
    let nodesBrushed = [];
    let linksBrushed = [];

    $: {
        if ($nodeFilter.length > 0) {
            nodesBrushed = nodes.filter(d => $nodeFilter.includes(d.label));
            linksBrushed = links.filter(d => $nodeFilter.includes(d.source.label) && $nodeFilter.includes(d.target.label));
        } else {
            nodesBrushed = nodes;
            linksBrushed = links;
        }
    }

    // Dimensions
    const width = 500;
    const height = 500;
    const margin = {top: 10, right: 20, bottom: 10, left: 20};
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    // Simulation Forces
    const linkForce = forceLink().id(d => d.label);
    const simulation = forceSimulation()
        .alphaTarget(0.02)   
        .alphaDecay(0.001)
        .force('link', linkForce)
        .force('charge', forceManyBody())
        .force("collide", forceCollide())
        .force("center", forceCenter(width / 2, height / 2))
        .on('tick', () => {
            nodesBrushed = nodesBrushed;
            linksBrushed = linksBrushed;
        });
    $: {
        simulation.nodes(nodesBrushed);
        linkForce.links(linksBrushed);
    }

    // Pause - Restart Simulation
    $: {
        $simulationPause ? simulation.stop() : simulation.restart();
    }

    // Binds
    let svg, g_element_nodes, g_element_links;
    onMount(() => {
		select(svg).call(zoomFunction(width, height));
	});

    function addNodeListeners(circle) {
        return {
            update(node) {
                select(circle).call(dragFunction(node, simulation));
            }
        }
    }

</script>

<svg height="100%" viewBox={`0 0 ${width} ${height}`} bind:this={svg}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g class="edges" bind:this={g_element_links}>
            {#each linksBrushed as link}
                <line class='link' 
                    x1={link.source.x} 
                    y1={link.source.y} 
                    x2={link.target.x} 
                    y2={link.target.y} 
                    stroke={colorScale_edges(link.value)}
                    stroke-width={$edge_width}
                    opacity={$toHighlight.includes(link.source.label) || $toHighlight.includes(link.target.label) ? 1 : $toHighlight.length > 1 ? .5 : 1} />
            {/each}
        </g>
        <g class="nodes" bind:this={g_element_nodes}>
            {#each nodesBrushed as node}
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <circle class='node' 
                        cx="{node.x}" 
                        cy="{node.y}" 
                        r={$radius}
                        fill={node.colour}
                        use:addNodeListeners={node}
                        on:mouseover={highlight(links, node)}
                        on:mouseout={fade}
                        opacity={$toHighlight.includes(node.label) ? 1 : $toHighlight.length > 0 ? 0.5 : 1} >
                    <title>{node.label}</title>
                </circle>     
            {/each}
        </g>
    </g>
</svg>


<style>
    .node {
        stroke: #fff;
        stroke-width: .9px;
    }
</style>