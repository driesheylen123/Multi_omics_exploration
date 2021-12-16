<script>

    // https://observablehq.com/@saehrimnir/hierarchical-clustering-with-druid-js

    import { scaleLinear } from 'd3';
    export let dendogram;
    export let type = "depth";
    export let data;
    export let margin;
    export let W;
    export let bandwidth;

    // Scales
    const h = scaleLinear()
        .domain([0, data.root[type.value]])
        .range([margin.bottom, W - margin.top]);

    // Functions
    const link = ({source, target}) => {
        const x1 = x_linear(source.x) + bandwidth/2;
        const y1 = h(source[type.value]);
        const x2 = x_linear(target.x) + bandwidthw/2;
        const y2 = h(target[type.value]);
        const max_radius = 20;
        const x_dist = Math.abs(x1 - x2);
        const y_dist = Math.abs(y1 - y2);
        const radius = Math.min(x_dist, y_dist, max_radius);
        const cx = x1 < x2 ? radius : -radius;
        const counter_clockwise = cx < 0 ? 0 : 1;
        const xa = x2 - cx;
        return `M ${y1} ${x1} V ${xa} a ${radius} ${radius} 0 0 ${counter_clockwise} ${-radius} ${cx} H ${y2}`;
    } 

</script>



<g>
    {#each dendogram.links as pth} 
        <path d={link}
            fill="none"
            stroke="black" />
    {/each}
</g>