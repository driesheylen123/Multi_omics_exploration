<script>
    import { scaleBand, scaleDiverging, interpolateRdBu } from 'd3';
    import { getContext } from 'svelte';

    export let width = 1000;
    export let height = 800;

    const {labels, matrixEdges} = getContext('data');

    // Variables
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    let innerHeight = height - margin.top - margin.bottom;
    let innerWidth = width - margin.left - margin.right;

    // Scales
    const rowScale = scaleBand().domain($labels).range([0, innerHeight]);
    const colScale = scaleBand().domain($labels).range([0, innerWidth]);
    const colorScale = scaleDiverging().domain([-1,0,1]).interpolator(interpolateRdBu);

    $: {
        rowScale.domain($labels);
        colScale.domain($labels);
    }

</script>


<svg width={width} height={height}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        {#each $matrixEdges as cell}
                <rect x={colScale(cell.source)}
                    y={rowScale(cell.target)}
                    width={colScale.bandwidth()-.5}
                    height={rowScale.bandwidth()-.5}
                    fill={colorScale(cell.value)} />
        {/each}
    </g>
</svg>