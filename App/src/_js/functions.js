import { zoom } from 'd3-zoom';
import { select, selectAll, filter, attr } from 'd3-selection';
import { drag } from 'd3-drag';
import { toHighlight, nodeFilter } from '../stores.js';

export function zoomFunction(w, h) {

    function zoomed({transform}) {
        select(this).select('g').attr("transform", transform);
    }
    return zoom()
        .extent([[0, 0], [w, h]])
        .on("zoom", zoomed);
}

export function dragFunction (node, simulation) {

    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        node.fx = event.subject.x;
        node.fy = event.subject.y;
    }
    function dragged(event) {
        node.fx = event.x;
        node.fy = event.y;
    }
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        node.fx = null;
        node.fy = null;
    }
    return drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

export function highlight(data, self) {
    const current = self.label;
    toHighlight.set([...new Set(data.filter(k => k.source.label === current || k.target.label === current).map(d => [d.source.label,d.target.label]).flat())]);
    
}
export function fade() {
    toHighlight.set([]);
}

export function brushFunction(element) {

    const cells = select(element).selectAll('rect');
    return function brush({selection}) {
        if (selection) {
            let [[x0,y0],[x1,y1]] = selection;
            const filter_function = (d, i, nodes) => (x0 <= nodes[i].attributes.x.value && nodes[i].attributes.x.value < x1 && y0 <= nodes[i].attributes.y.value && nodes[i].attributes.y.value < y1 || x0 <= (nodes[i].attributes.x.value + nodes[i].attributes.width.value) && nodes[i].attributes.x.value < x1 && y0 <= (nodes[i].attributes.y.value + nodes[i].attributes.height.value) && nodes[i].attributes.y.value < y1)
            cells.filter((d, i, nodes) => !filter_function(d, i, nodes)).attr('opacity', .3);
            cells.filter((d, i, nodes) => filter_function(d, i, nodes)).attr('opacity', 1);    
            nodeFilter.set([...new Set(Array.from(cells.filter((d, i, nodes) => filter_function(d, i, nodes))).map(d => [d.attributes.source.value, d.attributes.target.value]).flat())]);
        } else {
            cells.attr('opacity', 1);
            nodeFilter.set([]);
        }
    }
}