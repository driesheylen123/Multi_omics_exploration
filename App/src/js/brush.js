import { brush } from 'd3';
// import { selectedNodes } from '../stores.js'

export function brushFunction(nodes, selectedNodes, m, bandWidth) {

    function detail({selection}) {
        if (selection) {
            let [[x0,y0],[x1,y1]] = selection;
            x0-=m.left;
            y0-=m.top;
            x1-=m.left;
            y1-=m.top;
            selectedNodes = nodes.filter(d => x0 <= rowScale(d.label) && rowScale(d.label) < x1 && y0 <= colScale(d.label) && colScale(d.label) < y1 || x0 <= (rowScale(d.label) + bandWidth) && rowScale(d.label) < x1 && y0 <= (colScale(d.label) + bandWidth) && colScale(d.label) < y1);
            // console.log($selectedNodes);
        } else {
            selectedNodes = nodes;
        }
    }

    return brush().on("brush end", detail);
}