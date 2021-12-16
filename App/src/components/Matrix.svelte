<script>
    import { scaleBand, scaleDiverging, interpolateRdBu } from 'd3';
    import { getContext } from 'svelte';
    import { linkage } from '../stores.js'
    import { clustering } from '../druid.js';

    export let width = 1000;
    export let height = 800;

    const {nodes, matrixEdges, dataset} = getContext('data');
    $: matrixEdgesCopy = $matrixEdges;

    // Variables
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    let innerHeight = height - margin.top - margin.bottom;
    let innerWidth = width - margin.left - margin.right;

    // Scales
    const rowScale = scaleBand().domain($nodes.map(d => d.label)).range([0, innerHeight]);
    const colScale = scaleBand().domain($nodes.map(d => d.label)).range([0, innerWidth]);
    const colorScale = scaleDiverging().domain([-1,0,1]).interpolator(interpolateRdBu);

    $: {
        if ($dataset.length > 0) {
            if ($linkage !== 'none') {
                let order = clustering($dataset, $linkage);
                $nodes.sort((a,b) => {
                    return order.indexOf(a.id) - order.indexOf(b.id)
                });
            } else {
                $nodes.sort((a,b) => {
                    return a.id - b.id
                });
            }
        }
        rowScale.domain($nodes.map(d => d.label));
        colScale.domain($nodes.map(d => d.label));
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