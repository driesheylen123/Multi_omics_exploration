<script>

    import { scaleLinear } from 'd3-scale';
    import { max } from 'd3-array';

    import { linkage } from '../stores.js';
    import { links2Matrix, hclust, dendogram } from '../_js/functions.js';

    export let data = [];
    let nodes = [];
    let links = [];
    let matrix;

    $: {
        if (data.nodes) {
            nodes = data.nodes;
            links = data.links;
            matrix = links2Matrix(nodes, links);
        }
    }

    const width = 500; 
    const height = 200;
    
    let clust_order = [];
    let clust_nodes= [];
    let clust_links = [];
    const x = scaleLinear().range([0, width]);
    const y = scaleLinear().range([0, height]).nice();
    $: {
        if ($linkage !== 'none') {
            let clustering = hclust(matrix, $linkage);
            clust_order = clustering.root.index;
            clust_nodes = clustering.root.descendants();

            x.domain([0, nodes.length]);
            y.domain([max(clust_nodes, node => node["depth"]), 0]);

            let dendo = dendogram(clust_nodes);
            clust_links = dendo.links;
            console.log(clust_links);

            
        }
    }
    
    const link = (source, target) => {
        const x1 = x(source.x);
        const y1 = y(source["depth"]);
        const x2 = x(target.x);
        const y2 = y(target["depth"]);
        const max_radius = 20;
        const x_dist = Math.abs(x1 - x2);
        const y_dist = Math.abs(y1 - y2);
        const radius = Math.min(x_dist, y_dist, max_radius);
        const cx = x1 < x2 ? radius : -radius;
        const counter_clockwise = cx < 0 ? 0 : 1;
        const xa = x2 - cx;
        return `M ${x1} ${y1} H ${xa} a ${radius} ${radius} 0 0 ${counter_clockwise} ${cx} ${radius} V ${y2}`;
    }




    let svg, g_dendogram;
</script>


<svg width="100%" viewBox={`0 0 ${width} ${height}`} bind:this={svg}>
    <g bind:this={g_dendogram}>
        {#each clust_links as clust_link}
            <path d={link(clust_link.source, clust_link.target)}
                fill="none"
                stroke="grey">
            </path>
        {/each}
    </g>
</svg>