<script>
    
    import { max } from 'd3-array';
    import { scaleLinear } from 'd3-scale';

    import { threshold_clust, maxDepth, transformX, transformK } from '../stores';
    import { pathGenerator } from '../_js/functions';
    import { colorScale_clusters} from '../_js/scales';

    export let data = [];
    export let n;
    export let bandwidth = 0;

    const width = 500; 
    const height = 200;

    const xScale = scaleLinear().domain([0, n]).range([0, width]);
    const yScale = scaleLinear().range([0, height]).nice();
    $: yScale.domain([max(data.nodes, node => node["depth"]), 0])
    $: colorScale_clusters.domain([...Array($maxDepth).keys()]).unknown("grey");
    const c_value = (source) => {
                    const cluster_set = new Set(source.index.map(i => data.clusters[i]))
                    return cluster_set.size > 1 ? "grey" : colorScale_clusters([...cluster_set.values()][0])
                  }

</script>

<svg viewBox={`0 0 ${width} ${height}`}>
    <g transform={`translate(${(bandwidth*$transformK)/2}, ${0})`}>
        {#each data.links as link}
            <path d={pathGenerator(link, xScale, yScale, $transformX, $transformK)}
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