<script>
    
    import { pathGenerator } from '../_js/functions.js';
    import { max } from 'd3-array';
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { schemeTableau10 } from "d3-scale-chromatic";
    import { threshold_clust, maxDepth } from "../stores.js";

    export let data = [];
    export let n;
    export let bandwidth = 0;

    const width = 500; 
    const height = 200;

    const xScale = scaleLinear().domain([0, n]).range([0, width]);
    const yScale = scaleLinear().range([0, height]).nice();
    $: yScale.domain([max(data.nodes, node => node["depth"]), 0])
    const c = scaleOrdinal().domain([...Array($maxDepth).keys()]).range(schemeTableau10)
    const c_value = (source) => {
                    const cluster_set = new Set(source.index.map(i => data.clusters[i]))
                    return cluster_set.size > 1 ? "grey" : c([...cluster_set.values()][0])
                  }

</script>

<svg viewBox={`0 0 ${width} ${height}`}>
    <g transform={`translate(${bandwidth/2},0)`}>
        {#each data.links as link}
            <path d={pathGenerator(link, xScale, yScale)}
                fill="none"
                stroke={c_value(link.source)}>
            </path>
        {/each}
        <line x1={0} x2={width} y1={yScale($threshold_clust)} y2={yScale($threshold_clust)} class="line-threshold"></line>
    </g>
</svg>

<style>
    .line-threshold {
        stroke-width: 2px;
        stroke: darkred;
        stroke-dasharray: 20,4;
    }
</style>