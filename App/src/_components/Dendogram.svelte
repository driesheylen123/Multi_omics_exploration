<script>
    
    import { pathGenerator } from '../_js/functions.js';
    import { max } from 'd3-array';
    import { scaleLinear } from 'd3-scale';

    export let data = [];
    export let n;
    export let bandwidth = 0;

    const width = 500; 
    const height = 200;

    const xScale = scaleLinear().domain([0, n]).range([0, width]);
    const yScale = scaleLinear().domain([max(data.nodes, node => node["depth"]), 0]).range([0, height]).nice();

    let svg, g_dendogram;
</script>



<svg viewBox={`0 0 ${width} ${height}`} bind:this={svg}>
    <g transform={`translate(${bandwidth/2},0)`} bind:this={g_dendogram}>
        {#each data.links as link}
            <path d={pathGenerator(link, xScale, yScale)}
                fill="none"
                stroke="grey">
            </path>
        {/each}
        <!-- <line x1={0} x2={width} y1={} y2={} stroke="black"></line> -->
    </g>
</svg>