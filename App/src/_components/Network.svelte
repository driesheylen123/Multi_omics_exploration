<script>

    // Dependencies
    import { forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter } from 'd3-force';
    import { extent } from 'd3-array';
    import { select } from 'd3-selection';
    import { onMount } from 'svelte';
    import { simulationPause, radius, toHighlight, nodeFilter } from "../stores";

    // External JS
    import { colorScale } from '../_js/scales.js';
    import { zoomFunction, dragFunction, highlight, fade } from '../_js/functions';

    // Props
    export let data = [];

    // Data handling
    let nodes = [];
    let links = [];
    $: {
        if (data.nodes) {
            [nodes, links] = [data.nodes, data.links];
        }
    }

    $: {
        if ($nodeFilter.length > 0) {
            nodes = nodes.filter(d => $nodeFilter.includes(d.label));
            links = links.filter(d => $nodeFilter.includes(d.source.label) && $nodeFilter.includes(d.target.label));
        }
    }

    // Dimensions
    const width = 500;
    const height = 500;
    const margin = {top: 10, right: 20, bottom: 10, left: 20};
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    // Set Scale Domains
    $: {
        if (nodes.length > 0) {
            colorScale.domain(extent(links.map(d => d.value)));
        }
    }

    // Simulation Forces
    const linkForce = forceLink().id(d => d.label);
    const simulation = forceSimulation()
        .alphaTarget(0.02)   
        .alphaDecay(0.001)
        // .velocityDecay(120/nodes_network.length - 0.08)
        .force('link', linkForce)
        .force('charge', forceManyBody())
        .force("collide", forceCollide())
        .force("center", forceCenter(width / 2, height / 2))
        .on('tick', () => {
            nodes = nodes;
            links = links;
        });
    $: {
        simulation.nodes(nodes);
        linkForce.links(links);
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

<svg width="100%" viewBox="0 0 500 500" bind:this={svg}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g class="edges" bind:this={g_element_links}>
            {#each links as link}
                <line class='link' 
                    x1={link.source.x} 
                    y1={link.source.y} 
                    x2={link.target.x} 
                    y2={link.target.y} 
                    stroke={colorScale(link.value)}
                    opacity={$toHighlight.includes(link.source.label) || $toHighlight.includes(link.target.label) ? 1 : $toHighlight.length > 1 ? .5 : 1} />
            {/each}
        </g>
        <g class="nodes" bind:this={g_element_nodes}>
            {#each nodes as node}
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
        /* fill: #000981ce; */
        stroke: #fff;
        stroke-width: .9px;
    }
    .edges {
        stroke-width: 1px;
    }
</style>