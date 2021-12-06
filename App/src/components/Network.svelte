<script>
    import { onMount } from 'svelte';
    import { forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter } from 'd3';


    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    let simulation;
    let graph = {nodes: []};
    let data_asArrays = [];
    let current;

    export let data;
    export let width = 1000;
    export let height = 800;
    export let threshold = 0.3;
    export let radius = 4;

    onMount(() => {
        // Extract nodes
        data.columns.forEach(d => {
            graph.nodes.push({'id': d})
        });
        graph.nodes.shift();

        // Extract edges
        data.forEach(function(d) {
            current = Object.values(d);
            current.shift();
            data_asArrays.push(current);
        });
        graph.links = generateEdgelist(graph.nodes, data_asArrays, threshold);

        simulation = forceSimulation(graph.nodes)
            .alphaTarget(0.02)   
            .alphaDecay(0)
            // .velocityDecay(120/graph.nodes.length - 0.08)
            .force('link', forceLink(graph.links).id(d => d.id))
            .force('charge', forceManyBody())
            .force("collide", forceCollide())
            .force("center", forceCenter(width / 2, height / 2))
            .on('tick', () => {
                graph = graph;
            })
    });

    // Functions
    function generateEdgelist(nodes, sourceMatrix, threshold) {
        const edgeList = [];
        for(let s = 0; s < sourceMatrix.length; s++) {
            for(let t = 0; t < sourceMatrix.length; t++) {
                const v = +sourceMatrix[s][t];
                if(v > threshold) {
                    const edge = {source: nodes[s], target: nodes[t], value: v};
                    edgeList.push(Object.assign(edge));
                } 
            }
        }
        return edgeList;
    }


</script>

<svg width={width} height={height}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        {#if graph.links}
            <g class="edges">
                {#each graph.links as link}
                    <line class='link' x1={link.source.x} y1={link.source.y} x2={link.target.x} y2={link.target.y} style="stroke-width:{link.value}" />
                {/each}
            </g>
            <g class="nodes">
                {#each graph.nodes as node}
                    <circle class='node' cx="{node.x}" cy="{node.y}" r={radius} />
                {/each}
            </g>
        {/if}
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