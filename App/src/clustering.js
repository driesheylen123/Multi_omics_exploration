import { mean } from 'd3';

export function hclust(data, linkage) {

    // Transform into druidjs matrix object
    let matrix = druid.Matrix.from(data);

    // Do Hierarchical clustering
    let H = new druid.Hierarchical_Clustering(matrix, linkage, "precomputed");
            
    // New order
    let newOrder = H.root.index;

    // Nodes
    let nodes = H.root.descendants();

    // Dendogram
    function createDendogram(nodes) {
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
    let dendogram = createDendogram(nodes);

    return {
        'order': newOrder,
        'dendogram': dendogram,
        'result': H,
    }
               
}
