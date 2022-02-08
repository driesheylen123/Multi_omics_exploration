import { select, selectAll, filter, attr } from 'd3-selection';
import { mean } from 'd3-array';
import { nodeFilter } from '../stores.js';

export function link_filter(links, t) {
    let links_filtered;
    // Remove links beneath threshold
    links_filtered = links.filter(k => Math.abs(k.value) >= t);
    // Remove self links
    links_filtered = links_filtered.filter(k => k.source !== k.target);
    // Remove symmetric links
    links_filtered.forEach((el, i) => { el.referenceID = i });
    links_filtered.forEach((el, i, arr) => {
        const symLink = arr.filter(k => k.source === el.target && k.target === el.source);
        if (symLink.length != 0) {
            el.symmetricLink = symLink[0].referenceID;
        }
    });
    let toKeep = links_filtered.map(d => d.referenceID);
    links_filtered.forEach((el, i, nodes) => {
        if (toKeep.includes(el.referenceID)) {
            toKeep = toKeep.filter(k => k !== el.symmetricLink);
        }
    });
    links_filtered = links_filtered.filter(k => toKeep.includes(k.referenceID));
    
    return links_filtered;
}

export function brushFunction(element) {

    const cells = select(element).selectAll('rect');
    return function brush({selection}) {
        if (selection) {
            let [[x0,y0],[x1,y1]] = selection;
            const filter_function = (d, i, nodes) => (x0 <= Number(nodes[i].attributes.x.value) && Number(nodes[i].attributes.x.value) < x1 && y0 <= Number(nodes[i].attributes.y.value) && Number(nodes[i].attributes.y.value) < y1 || x0 <= (Number(nodes[i].attributes.x.value) + Number(nodes[i].attributes.width.value)) && Number(nodes[i].attributes.x.value) < x1 && y0 <= (Number(nodes[i].attributes.y.value) + Number(nodes[i].attributes.height.value)) && Number(nodes[i].attributes.y.value) < y1)
            cells.filter((d, i, nodes) => !filter_function(d, i, nodes)).attr('opacity', .3);
            cells.filter((d, i, nodes) => filter_function(d, i, nodes)).attr('opacity', 1);    
            nodeFilter.set([...new Set(Array.from(cells.filter((d, i, nodes) => filter_function(d, i, nodes))).map(d => [d.attributes.source.value, d.attributes.target.value]).flat())]);
        } else {
            cells.attr('opacity', 1);
            nodeFilter.set([]);
        }
    }
}

export function links2Matrix(nodes, links) {
    const matrix = [];
    for (const source of nodes) {
        const row = [];
        for (const target of nodes) {
            const cell = links.filter(k => k.source === source.label && k.target === target.label);
            cell.length !== 0 ? row.push(cell[0].value) : row.push(0);
        }
        matrix.push(row);
    }
    return matrix;
}

export function hclust(adjMatrix, linkage) {
    let matrix = druid.Matrix.from(adjMatrix);
    let H = new druid.Hierarchical_Clustering(matrix, linkage, "precomputed");
    return H;
}

export function dendogram(nodes) {
    const leaves = nodes.filter(n => n.isLeaf);
    const links = [];
    leaves.forEach((node, i) => node.x = i)
    nodes.forEach((node, i) => {
        node.x = node.x ?? mean(node.leaves(), d => d.x);
        [node.left, node.right].forEach(child => {
        if (child) {
            links.push({
            "source": node,
            "target": child
            })
        }
        })
    })
    return {
        "nodes": nodes,
        "links": links,
    }
}

export function clusters(H, t, n) {
    const H_clusters = H.get_clusters(t, "depth");
    let I = Array.from({length: n});
    
    for (let cluster_index = 0; cluster_index < H_clusters.length; ++cluster_index) {
        H_clusters[cluster_index].forEach(({index}) => I[index] = cluster_index)
    }
    
    return I
}

export function pathGenerator(link, x, y) {
    const x1 = x(link.source.x);
    const y1 = y(link.source["depth"]);
    const x2 = x(link.target.x);
    const y2 = y(link.target["depth"]);
    const max_radius = 20;
    const x_dist = Math.abs(x1 - x2);
    const y_dist = Math.abs(y1 - y2);
    const radius = Math.min(x_dist, y_dist, max_radius);
    const cx = x1 < x2 ? radius : -radius;
    const counter_clockwise = cx < 0 ? 0 : 1;
    const xa = x2 - cx;
    return `M ${x1} ${y1} H ${xa} a ${radius} ${radius} 0 0 ${counter_clockwise} ${cx} ${radius} V ${y2}`;
}