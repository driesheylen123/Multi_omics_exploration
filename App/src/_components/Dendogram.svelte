<script>
    
    import { pathGenerator } from '../_js/functions.js';
    import { max } from 'd3-array';
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { schemeDark2 } from "d3-scale-chromatic";
    import { threshold_clust } from "../stores.js";

    export let data = [];
    export let n;
    export let bandwidth = 0;
    console.log(data);

    const width = 500; 
    const height = 200;

    const xScale = scaleLinear().domain([0, n]).range([0, width]);
    const yScale = scaleLinear().domain([max(data.nodes, node => node["depth"]), 0]).range([0, height]).nice();
    const c = scaleOrdinal(schemeDark2).domain(Array.from(new Set(data.clusters)));
    const c_value = (source) => {
                    const cluster_set = new Set(source.index.map(i => data.clusters[i]))
                    return cluster_set.size > 1 ? "grey" : c([...cluster_set.values()][0])
                  }

    let svg, g_dendogram;
</script>



<svg viewBox={`0 0 ${width} ${height}`} bind:this={svg}>
    <g transform={`translate(${bandwidth/2},0)`} bind:this={g_dendogram}>
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