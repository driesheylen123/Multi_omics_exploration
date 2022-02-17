import { writable, derived } from 'svelte/store';
import { link_filter } from './_js/functions';

// Navigation
export const threshold_edges = writable(0);
export const threshold_clust = writable(10);
export const maxDepth = writable(10);
export const radius = writable(4);
export const linkage = writable("none");
export const renderVisuals = writable(false);
export const simulationPause = writable(false);
export const toHighlight = writable([]);
export const nodeFilter = writable([]);
export const color_method_nodes = writable();
export const color_method_edges = writable();
export const edge_width = writable(1);
export const domain_min = writable(-1);
export const domain_center = writable(0);
export const domain_max = writable(1);
export const transformX = writable(0);
export const transformY = writable(0);
export const transformK = writable(1);

// Data
export const toggle_sidebar = writable(false);
export const _data = writable([]);
export const nodes = derived(_data, ($_data) => {
    if (!$_data.nodes) {
        return [];
    }
    if (!$_data.nodes[0].id) {
        $_data.nodes.forEach((element, index) => element.id = index);
    }
    return $_data.nodes.map(d => d);
});
export const node_variables = derived(_data, ($_data) => {
    if (!$_data.nodes) {
        return [];
    }
    return Object.keys($_data.nodes[0]).filter(k => !(k === "label" || k === "id"))
});
export const links_network = derived([_data, threshold_edges], ([$_data, $threshold_edges]) => {
    if (!$_data.links) {
        return [];
    }
    const links = $_data.links.map(d => { return {source: d.source, target: d.target, value: d.value} });
    return link_filter(links, $threshold_edges);
});
export const links_heatmap = derived(_data, ($_data) => {
    if (!$_data.links) {
        return [];
    }
    return $_data.links.map(d => { return {source: d.source, target: d.target, value: d.value} });
});
export const link_variables = derived(_data, ($_data) => {
    if (!$_data.links) {
        return [];
    }
    return Object.keys($_data.links[0]).filter(k => !(k === "source" || k === "target" || k === "referenceID" || k === "symmetricLink"))
});