<script>

    import { pathGenerator } from '../_js/functions.js';

    export let data = [];
    export let n;
    export let bandwidth = 0;

    const width = 500; 
    const height = 200;

    let svg, g_dendogram;
</script>


<svg width="100%" viewBox={`0 0 ${width} ${height}`} bind:this={svg}>
    <g transform={`translate(${bandwidth/2},0)`} bind:this={g_dendogram}>
        {#each data.links as clust_link}
            <path d={pathGenerator(clust_link, data.nodes, n, width, height)}
                fill="none"
                stroke="grey">
            </path>
        {/each}
    </g>
</svg>