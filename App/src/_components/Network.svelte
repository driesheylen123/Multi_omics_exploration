<script>

    // Dependencies
    import { onMount } from 'svelte';
    import ForceGraph from 'force-graph';
    import { simulationPause, radius, toHighlight, nodeFilter, edge_width } from "../stores";

    // External JS
    import { colorScale_edges } from '../_js/scales.js';

    // Props
    export let nodes = [];
    export let links = [];
    let nodesBrushed = [];
    let linksBrushed = [];

    $: {
        if ($nodeFilter.length > 0) {
            nodesBrushed = nodes.filter(d => $nodeFilter.includes(d.label));
            linksBrushed = links.filter(d => $nodeFilter.includes(d.source.label) && $nodeFilter.includes(d.target.label));
            draw();
        } else {
            nodesBrushed = nodes;
            linksBrushed = links;
            if (graph_area) {
                draw();
            }
        }
    }

    // Dimensions
    const width = 500;
    const height = 500;
    const margin = {top: 10, right: 20, bottom: 10, left: 20};
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    // Binds
    let myGraph = ForceGraph();
    let graph_area;

    function draw() {
        myGraph(graph_area)
            .graphData({"nodes": nodesBrushed, "links": linksBrushed})
            .d3AlphaDecay(0.001)
            .backgroundColor("white")
            .width(width)
            .height(height)
            .nodeId('label')
            .nodeColor(node => $toHighlight.includes(node.label) ? "rgba(0,0,0,1)" : $toHighlight.length > 0 ? "rgba(0,0,0,.5)" : "rgba(0,0,0,1)")
            .nodeLabel('label')
            .linkColor((link) => {
                if ($toHighlight.length != 0) {
                    if ($toHighlight.includes(link.source.label) || $toHighlight.includes(link.target.label)) {
                        return colorScale_edges(link.value)
                    } else {
                        const c_rgb = colorScale_edges(link.value);
                        const c_rgba = c_rgb.replace(/rgb/i, "rgba").replace(/\)/i, ".5");
                        return c_rgba
                    }
                } else {
                    return colorScale_edges(link.value)
                }
            })
            .linkWidth((link) => $toHighlight.includes(link.source.label) || $toHighlight.includes(link.target.label) ? 1.3 : 1)
            .onNodeHover((node) => {
                if (node) {
                    $toHighlight = [...new Set(linksBrushed.filter(k => k.source.label === node.label || k.target.label === node.label).map(d => [d.source.label, d.target.label]).flat())];
                } else {
                    $toHighlight = [];
                }
            })
            .autoPauseRedraw(false);
    }

</script>

<div class="position-relative" bind:this={graph_area}></div>