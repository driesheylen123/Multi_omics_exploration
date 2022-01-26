<script>

    // Dependencies
    import { scaleBand } from 'd3-scale';
    import { extent } from 'd3-array';
    import { brush } from 'd3-brush';
    import { select } from 'd3-selection';
    import { onMount } from 'svelte';
    import Dendogram from './Dendogram.svelte';

    // External JS
    import { colorScale } from '../_js/scales.js';
    import { brushFunction, links2Matrix, hclust, dendogram } from '../_js/functions';
    import { linkage } from '../stores.js';
   
    // Props
    export let data = [];

    // Data handling
    let nodes = [];
    let links = [];
    let matrix;
    $: {
        if (data.nodes) {
            [nodes, links] = [data.nodes, data.links];
            matrix = links2Matrix(nodes, links);
            if (!nodes.id) {
                nodes.forEach((element, index) => element.id = index );
            }
        }
    }

    // Dimensions
    const width = 500;
    const height = 500;

    // Scales
    let bandWidth;
    const rowScale = scaleBand().range([0, height]);
    const colScale = scaleBand().range([0, width]);
    // Set Scale Domains
    $: {
        if (nodes.length > 0) {
            rowScale.domain(nodes.map(d => d.label));
            colScale.domain(nodes.map(d => d.label));
            bandWidth = colScale.bandwidth();
            colorScale.domain(extent(links.map(d => d.value)));
        }
    }

    // Clustering
    const h_clustering = {nodes: [], links: []};
    $: {
        if ($linkage !== 'none') {
            let clustering = hclust(matrix, $linkage);
            let order = clustering.root.index;
            nodes.sort((a,b) => order.indexOf(a.id) - order.indexOf(b.id));
            h_clustering.nodes = clustering.root.descendants();
            h_clustering.links = dendogram(h_clustering.nodes).links;
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
                <rect x={colScale(cell.target.label)} 
                    y={rowScale(cell.source.label)} 
                    width={colScale.bandwidth()-.5} 
                    height={rowScale.bandwidth()-.5}
                    fill={colorScale(cell.value)}
                    class="matrix-cell"
                    source={cell.source.label}
                    target={cell.target.label}>
                    <title> {`source: ${cell.source.label} - target: ${cell.target.label}`} </title>
                </rect>
            {/each}
        </g>
    </svg>
</div>