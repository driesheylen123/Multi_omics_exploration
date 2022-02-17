<script>

    // Dependencies
    import { scaleBand, scaleDiverging } from 'd3-scale';
    import { interpolateRdBu } from 'd3-scale-chromatic';
    import { brush } from 'd3-brush';
    import { select } from 'd3-selection';
    import { zoom } from 'd3-zoom';
    import { onMount } from 'svelte';
    import Dendogram from './Dendogram.svelte';

    // External JS
    import { zoomFunction, brushFunction, links2Matrix, hclust, clusters, dendogram } from '../_js/functions';
    import { domain_min, domain_center, domain_max, transformX, transformY, transformK, linkage, threshold_clust, maxDepth } from '../stores.js';
   
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
    const colorScale = scaleDiverging().interpolator(interpolateRdBu);

    $: {
        colorScale.domain([$domain_min, $domain_center, $domain_max]);
        links = links;
    }

    // Clustering
    const h_clustering = {nodes: [], links: [], clusters: []};
    $: {
        if ($linkage !== 'none') {
            let clustering = hclust(matrix, $linkage);
            $maxDepth = clustering.root["depth"];
            h_clustering.nodes = clustering.root.descendants();
            h_clustering.links = dendogram(h_clustering.nodes).links;
            h_clustering.clusters = clusters(clustering, $threshold_clust, nodes.length);
            nodes.forEach((d, i) => d.cluster = h_clustering.clusters[i]);
            let order = clustering.root.index;
            nodes.sort((a,b) => order.indexOf(a.id) - order.indexOf(b.id));
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
		select(svg).call(brush().filter(() => !event.shiftKey).on("brush end", brushFunction(g_heatmap)));
        select(svg).call(zoom().filter(() => event.shiftKey).extent([[0, 0], [width, height]]).on('zoom', function({transform}) {
            $transformX = transform.x;
            $transformY = transform.y;
            $transformK = transform.k;
            select(this).select('g').attr("transform", transform);
            select(svg).select('.selection')._groups[0][0].attributes.style.value = "display: none";
        }));
	});

</script>

{#if $linkage !== "none"}
    <div>
        <Dendogram data={h_clustering} n={nodes.length} bandwidth={bandWidth}></Dendogram>
    </div>
{/if}
<div class="mb-3">
    <svg viewBox={`0 0 ${width} ${height}`} bind:this={svg}>
        <g bind:this={g_heatmap}>
            {#each links as cell}
                <rect x={colScale(cell.target)} 
                    y={rowScale(cell.source)} 
                    width={colScale.bandwidth()-.5} 
                    height={rowScale.bandwidth()-.5}
                    fill={cell.value ? colorScale(cell.value) : "black"}
                    class="matrix-cell"
                    source={cell.source}
                    target={cell.target}>
                    <title> {`source: ${cell.source} - target: ${cell.target}`} </title>
                </rect>
            {/each}
        </g>
    </svg>
</div>