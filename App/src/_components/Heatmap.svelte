<script>

    // Dependencies
    import { scaleBand } from 'd3-scale';
    import { extent } from 'd3-array';
    import { brush } from 'd3-brush';
    import { select } from 'd3-selection';
    import { onMount } from 'svelte';

    // External JS
    import { colorScale } from '../_js/scales.js';
    import { brushFunction } from '../_js/functions';
   
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

    // Dimensions
    const width = 500;
    const height = 500;

    // Scales
    const rowScale = scaleBand().range([0, height]);
    const colScale = scaleBand().range([0, width]);
    // Set Scale Domains
    $: {
        if (nodes.length > 0) {
            rowScale.domain(nodes.map(d => d.label));
            colScale.domain(nodes.map(d => d.label));
            colorScale.domain(extent(links.map(d => d.value)));
        }
    }

    // Binds
    let svg, g_heatmap;
    onMount(() => {
		select(svg).call(brush().on("brush end", brushFunction(g_heatmap)));
	});

</script>

<svg width="100%" viewBox="0 0 500 500" bind:this={svg}>
    <g bind:this={g_heatmap}>
        {#each links as cell}
            <rect x={colScale(cell.source.label)} 
                y={rowScale(cell.target.label)} 
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