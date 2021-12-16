<script>
    import { getContext } from 'svelte';
    import { forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter, select } from 'd3';
    import { dragFunction } from '../drag.js'

    const {nodes, edges} = getContext('data');
    $: nodesCopy = $nodes;
    $: edgesCopy = $edges;

    const margin = {top: 10, right: 10, bottom: 10, left: 10};
   
    export let width = 1000;
    export let height = 800;
    export let radius = 4;

    const linkForce = forceLink().id(d => d.label);
    const simulation = forceSimulation()
        .alphaTarget(0.02)   
        .alphaDecay(0)
        // .velocityDecay(120/graph.nodes.length - 0.08)
        .force('link', linkForce)
        .force('charge', forceManyBody())
        .force("collide", forceCollide())
        .force("center", forceCenter(width / 2, height / 2))
        .on('tick', () => {
            nodesCopy = nodesCopy;
            edgesCopy = edgesCopy;
        });

    $: {
        simulation.nodes(nodesCopy);
        linkForce.links(edgesCopy);
    }


    // Functions
    function addCustomListeners(circle) {

        return {
            update(node) {
                // Add the d3-drag eventListener to each circle element
                select(circle).call(dragFunction(node, simulation))
            }
        }

    }

</script>

<svg width={width} height={height}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g class="edges">
            {#each edgesCopy as link}
                <line class='link' 
                    x1={link.source.x} 
                    y1={link.source.y} 
                    x2={link.target.x} 
                    y2={link.target.y} 
                    style="stroke-width:{link.value}" />
            {/each}
        </g>
        <g class="nodes">
            {#each nodesCopy as node}
                <circle class='node' 
                use:addCustomListeners={node}
                cx="{node.x}" 
                cy="{node.y}" 
                r={radius}
                />         
            {/each}
        </g>
    </g>
</svg>


<style>
    .node {
        fill: #000981ce;
        stroke: #fff;
        stroke-width: 1px;
    }
    .link {
        stroke: #cccccc;
        stroke-opacity: .6;
    }
</style>