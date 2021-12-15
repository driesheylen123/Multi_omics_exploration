<script>
    import { scaleBand, scaleDiverging, interpolateRdBu } from 'd3';
    import { getContext } from 'svelte';
    import { linkage } from '../stores.js'
    import { clustering } from '../druid.js';

    export let width = 1000;
    export let height = 800;

    const {labels, matrixEdges, dataset} = getContext('data');
    $: matrixEdgesCopy = $matrixEdges;

    // Variables
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    let innerHeight = height - margin.top - margin.bottom;
    let innerWidth = width - margin.left - margin.right;

    // Scales
    const rowScale = scaleBand().domain($labels).range([0, innerHeight]);
    const colScale = scaleBand().domain($labels).range([0, innerWidth]);
    const colorScale = scaleDiverging().domain([-1,0,1]).interpolator(interpolateRdBu);

    // Bug: indexOf() changes previous ordenings... need to find another way.
    $: {
        if ($dataset.length > 0) {
            if ($linkage !== 'none') {
                let order = clustering($dataset, $linkage);
                console.log(order);
                $labels.sort((a,b) => {
                    return order.indexOf($labels.indexOf(a)) - order.indexOf($labels.indexOf(b))
                });
            } 
        }
        rowScale.domain($labels);
        colScale.domain($labels);
        matrixEdgesCopy = matrixEdgesCopy;
    }

</script>


<svg width={width} height={height}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        {#each matrixEdgesCopy as cell}
                <rect x={colScale(cell.source)}
                    y={rowScale(cell.target)}
                    width={colScale.bandwidth()-.5}
                    height={rowScale.bandwidth()-.5}
                    fill={colorScale(cell.value)} />
        {/each}
    </g>
</svg>