<script>
    import { getContext } from 'svelte';
    import { forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter, select, zoom } from 'd3';
    import { dragFunction } from '../js/drag.js';
    import { zoomFunction } from '../js/zoom.js';
    import { selectedNodes } from '../stores.js'

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

    $: {
        if ($selectedNodes.length > 0) {
            // console.log($selectedNodes);
            nodesCopy = $selectedNodes;
            edgesCopy = edgesCopy.filter(r => $selectedNodes.map(d => d.label).includes(r.source.label) && $selectedNodes.map(d => d.label).includes(r.target.label));
        }
    }


    // Functions
    function addNodeListeners(circle) {

        return {
            update(node) {
                // Add the d3-drag eventListener to each circle element
                select(circle).call(dragFunction(node, simulation))
            }
        }

    }

    function addSVGListeners(dom) {
        select(dom).call(zoomFunction(width, height));
    }

</script>

<svg width={width} height={height} use:addSVGListeners>
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
                use:addNodeListeners={node}
                cx="{node.x}" 
                cy="{node.y}" 
                r={radius}
                title={node.label}
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
        opacity: 1;
    }
    .link {
        stroke: #cccccc;
        stroke-opacity: .6;
    }
</style>