<script>
    import { getContext } from 'svelte';
    import { forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter, select, selectAll } from 'd3';
    import { dragFunction } from '../js/drag.js';
    import { zoomFunction } from '../js/zoom.js';
    import { radius, selectedNodes, highlighted } from '../stores.js'

    const {nodes, edges} = getContext('data');
    $: nodesCopy = $nodes;
    $: edgesCopy = $edges;

    const margin = {top: 10, right: 20, bottom: 10, left: 20};

    const width = 500;
    const height = 500;

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

    // Node highlighting
    function highlight() {
        const current = select(this).attr('title');
        $highlighted.push(current);
        $highlighted.push(...edgesCopy.filter(k => k.source.label === current).map(d => d.target.label));
        $highlighted.push(...edgesCopy.filter(k => k.target.label === current).map(d => d.source.label));
        $highlighted = [...new Set($highlighted)];
    }

    function fade() {
        $highlighted = [];
    }

</script>

<svg width="100%" viewBox="0 0 500 500" use:addSVGListeners>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g class="edges">
            {#each edgesCopy as link}
                <line class='link' 
                    x1={link.source.x} 
                    y1={link.source.y} 
                    x2={link.target.x} 
                    y2={link.target.y} 
                    style="stroke-width:{link.value}" 
                    opacity={$highlighted.includes(link.source.label) || $highlighted.includes(link.target.label) ? 1 : $highlighted.length > 1 ? .5 : 1}
                    />
            {/each}
        </g>
        <g class="nodes">
            {#each nodesCopy as node}
                <circle class='node' 
                        use:addNodeListeners={node}
                        cx="{node.x}" 
                        cy="{node.y}" 
                        r={$radius}
                        title={node.label}
                        on:mouseover={highlight}
                        on:mouseout={fade}
                        opacity={$highlighted.includes(node.label) ? 1 : $highlighted.length > 0 ? 0.5 : 1}>
                    <title> { node.label } </title>
                </circle>       
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
    }
</style>