import { drag } from 'd3';

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