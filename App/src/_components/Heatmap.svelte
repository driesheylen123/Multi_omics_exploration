<script>

    // Dependencies
    import { scaleBand } from 'd3-scale';
    import { extent } from 'd3-array';
    import { brush } from 'd3-brush';
    import { select } from 'd3-selection';
    import { onMount } from 'svelte';
    import Dendogram from './Dendogram.svelte';

    // External JS
    import { colorScale_edges } from '../_js/scales.js';
    import { brushFunction, links2Matrix, hclust, clusters, dendogram } from '../_js/functions';
    import { linkage, threshold_clust, maxDepth } from '../stores.js';
   
    // Props
    export let nodes = [];
    export let links = [];
    let matrix = links2Matrix(nodes, links);

    // Dimensions
    const width = 500;
    const height = 500;

    // Scales
    const rowScale = scaleBand().domain(nodes.map(d => d.label)).range([0, height]);
    const colScale = scaleBand().domain(nodes.map(d => d.label)).range([0, width]);
    const bandWidth = colScale.bandwidth();

    // Clustering
    const h_clustering = {nodes: [], links: [], clusters: []};
    $: {
        if ($linkage !== 'none') {
            let clustering = hclust(matrix, $linkage);
            $maxDepth = clustering.root["depth"];
            let order = clustering.root.index;
            nodes.sort((a,b) => order.indexOf(a.id) - order.indexOf(b.id));
            h_clustering.nodes = clustering.root.descendants();
            h_clustering.links = dendogram(h_clustering.nodes).links;
            h_clustering.clusters = clusters(clustering, $threshold_clust, nodes.length);
        } else {
            nodes.sort((a,b) => a.id - b.id);
        }
        rowScale.domain(nodes.map(d => d.label));
        colScale.domain(nodes.map(d => d.label));
        links = links;
    }  

    // Binds
    let svg, g_heatmap;
    onMount(() => {
		select(svg).call(brush().on("brush end", brushFunction(g_heatmap)));
	});

</script>

{#if $linkage !== "none"}
    <div>
        <Dendogram data={h_clustering} n={nodes.length} bandwidth={bandWidth}></Dendogram>
    </div>
{/if}
<div>
    <svg viewBox={`0 0 ${width} ${height}`} bind:this={svg}>
        <g bind:this={g_heatmap}>
            {#each links as cell}
                <rect x={colScale(cell.target)} 
                    y={rowScale(cell.source)} 
                    width={colScale.bandwidth()-.5} 
                    height={rowScale.bandwidth()-.5}
                    fill={colorScale_edges(cell.value)}
                    class="matrix-cell"
                    source={cell.source}
                    target={cell.target}>
                    <title> {`source: ${cell.source} - target: ${cell.target}`} </title>
                </rect>
            {/each}
        </g>
    </svg>
</div>