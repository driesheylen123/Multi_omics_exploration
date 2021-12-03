<script>
    import { scaleBand, scaleDiverging, interpolateRdBu } from 'd3';
    import { clear_loops } from 'svelte/internal';

    export let data = [];
    export let width = 1000;
    export let height = 800;

    // Variables
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    let innerHeight = height - margin.top - margin.bottom;
    let innerWidth = width - margin.left - margin.right;

    // Scales
    const rowScale = scaleBand().range([0, innerHeight]);
    const colScale = scaleBand().domain([0, 150]).range([0, innerWidth]);
    const colorScale = scaleDiverging().domain([-1,0,1]).interpolator(interpolateRdBu);

    // Data Engeneering
    // Extracting labels
    let labels;
    $: {
        labels = data.columns;
        // If labels is not empty (meaning data is loaded)
        if (labels) {
            // remove first array element bcs empty
            labels.shift(); 
            // adjust domain of scales.
            rowScale.domain(labels);
            colScale.domain(labels);
        }
    }

</script>


<svg width={width} height={height}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        {#each data as row, i}
            {#each Object.entries(row) as [label, value]}
                {#if label} 
                    <rect x={colScale(label)}
                        y={rowScale(labels[i])}
                        width={colScale.bandwidth()-.5}
                        height={rowScale.bandwidth()-.5}
                        fill={colorScale(value)} />
                {/if}
            {/each}
        {/each}
    </g>
</svg>