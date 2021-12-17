import { zoom, select } from 'd3';

export function zoomFunction(w, h) {

    // Zooming
    function zoomed({transform}) {
        select(this).select('g').attr("transform", transform);
    }

    return zoom()
        .extent([[0, 0], [w, h]])
        .on("zoom", zoomed);
}