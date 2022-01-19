<script>
    import { scaleBand, scaleDiverging, interpolateRdBu, select, brush } from 'd3';
    import { getContext } from 'svelte';
    import { linkage, selectedNodes } from '../stores.js'
    import { hclust } from '../js/clustering.js';
    // import { brushFunction } from '../js/brush.js';
    import Dendogram from './Dendogram.svelte';

    const width = 500;
    const height = 500;

    const {nodes, matrixEdges, dataset} = getContext('data');
    $: matrixEdgesCopy = $matrixEdges;

    // Variables
    const margin = {top: 10, right: 20, bottom: 10, left: 20};
    let innerHeight = height - margin.top - margin.bottom;
    let innerWidth = width - margin.left - margin.right;
    let drawDendogram = 0;

    // Scales
    const rowScale = scaleBand().domain($nodes.map(d => d.label)).range([0, innerHeight]);
    const colScale = scaleBand().domain($nodes.map(d => d.label)).range([0, innerWidth]);
    const colorScale = scaleDiverging().domain([-1,0,1]).interpolator(interpolateRdBu);
    let bandWidth;
    

    $: {
        if ($dataset.length > 0) {
            if ($linkage !== 'none') {
                let {order, dendogram, result} = hclust($dataset, $linkage);
                $nodes.sort((a,b) => {
                    return order.indexOf(a.id) - order.indexOf(b.id)
                });
                drawDendogram = 1;
            } else {
                $nodes.sort((a,b) => {
                    return a.id - b.id
                });
                drawDendogram = 0;
            }
        }
        rowScale.domain($nodes.map(d => d.label));
        colScale.domain($nodes.map(d => d.label));
        bandWidth = rowScale.bandwidth();
        matrixEdgesCopy = matrixEdgesCopy;
    }

    // Functions
    const brushing = brush().on("brush end", detail);

    function detail({selection}) {
        if (selection) {
            let [[x0,y0],[x1,y1]] = selection;
            x0-=margin.left;
            y0-=margin.top;
            x1-=margin.left;
            y1-=margin.top;
            $selectedNodes = $nodes.filter(d => x0 <= colScale(d.label) && colScale(d.label) < x1 || y0 <= rowScale(d.label) && rowScale(d.label) < y1 || x0 <= (colScale(d.label) + bandWidth) && colScale(d.label) < x1 || y0 <= (rowScale(d.label) + bandWidth) && rowScale(d.label) < y1);
        } else {
            $selectedNodes = $nodes;
        }
    }

    function addCustomListeners(dom) {
        select(dom).call(brushing);
        // select(dom).call(brushFunction($nodes, $selectedNodes, margin, bandWidth));
    }

</script>


<svg width="100%" viewBox="0 0 500 500" use:addCustomListeners>
    <!-- Matrix -->
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        {#each matrixEdgesCopy as cell}
                <rect x={colScale(cell.source)}
                    y={rowScale(cell.target)}
                    width={colScale.bandwidth()-.5}
                    height={rowScale.bandwidth()-.5}
                    fill={colorScale(cell.value)} 
                    opacity={$selectedNodes.map(d => d.label).includes(cell.source) && $selectedNodes.map(d => d.label).includes(cell.target) ? 1 : $selectedNodes.length > 0 ? .3 : 1}
                    />
        {/each}
    </g>
    <!-- Dendogram -->
    {#if drawDendogram}
        <!-- <Dendogram dendogram={dendogram} 
            type="depth" 
            data={result} 
            margin={margin} 
            width:[width] 
            bandwidth={bandwidth}>
        </Dendogram> -->
        <!-- Type can be either "depth" of "dist" -->
    {/if}
</svg>
