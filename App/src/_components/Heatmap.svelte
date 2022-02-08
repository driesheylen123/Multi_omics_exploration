<script>

    // Dependencies
    import { scaleBand } from 'd3-scale';
    import { select } from 'd3-selection';
    import { brush } from 'd3-brush';
    import { onMount } from 'svelte';
    import Dendogram from './Dendogram.svelte';

    // External JS
    import { nodeFilter } from '../stores';
    import { colorScale_edges } from '../_js/scales.js';
       
    // Props
    export let nodes = [];
    export let links = [];

    const nodesArray = nodes.map(d => d.label);
    let columnNodes, rowNodes;

    // Dimensions
    const width = 500;
    const height = 500;
    const margin = {top: 10, right: 10, bottom: 10, left: 10};

    // Scales
    const padding = 0;
    const rowScale = scaleBand().domain(nodesArray).range([0, height]).padding(padding);
    const colScale = scaleBand().domain(nodesArray).range([0, width]).padding(padding);
    const bandWidth = colScale.bandwidth();

    // Bind
    let matrix_area, ctx, svg;
    onMount(() => {
        select(svg).call(brush().on("brush end", brushed));

        ctx = matrix_area.getContext("2d");
        
    });

    $: { 
        if ($nodeFilter) {
            if (ctx) {
                draw()
            }
        }
    }    

    const highlight = function(node) {
        if ($nodeFilter.length != 0) {
            if (columnNodes.includes(node.source) && rowNodes.includes(node.target)) {
                return colorScale_edges(node.value)
            } else {
                const c_rgb = colorScale_edges(node.value);
                const c_rgba = c_rgb.replace(/rgb/i, "rgba").replace(/\)/i, ",0.3)");
                return c_rgba
            }
        } else {
            return colorScale_edges(node.value)
        }
    }

    function draw() {
        ctx.clearRect(0,0,width,height);
        links.forEach((link) => {
            ctx.fillStyle = highlight(link);
            ctx.fillRect(colScale(link.source), rowScale(link.target), bandWidth, bandWidth);
        });
    }

    const brushed = ({selection}) => {
        if (selection) {
            const [[x0,y0],[x1,y1]] = selection;
            columnNodes = nodesArray.slice(Math.floor(x0/bandWidth), Math.floor(x1/bandWidth));
            rowNodes = nodesArray.slice(Math.floor(y0/bandWidth), Math.floor(y1/bandWidth));
            const combined = new Set([...columnNodes,...rowNodes]);
            $nodeFilter = [...combined];
        } else {
            $nodeFilter = [];
        }  
    }
</script>

<div class="position-relative mb-3">
    <canvas class="position-absolute" width={width} height={height} bind:this={matrix_area}></canvas>
    <svg class="position-absolute" width={width} height={height} bind:this={svg}></svg>
</div>

<style>
    div {
        height: 500px;
    }
</style>