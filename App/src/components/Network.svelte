<script>
    import { forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter } from 'd3';
    
    export let data = [];
    export let width = 1000;
    export let height = 800;
    export let threshold = 0.2;
    export let radius = 4;

    // Variables
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    let innerHeight = height - margin.top - margin.bottom;
    let innerWidth = width - margin.left - margin.right;
    let nodes = [];

    // Data Engeneering
    let data_asArrays = [];
    let current;
    let labels;
    let edgeList;
    let simulation;
    $: {
        // Transform array of objects to array of arrays
        data.forEach(function(d) {
            current = Object.values(d);
            current.shift();
            data_asArrays.push(current);
        });

        labels = data.columns;
        // If labels is not empty (meaning data is loaded)
        if (labels) {
            // remove first array element bcs empty
            labels.shift(); 
            // Generate adjacency matrix
            edgeList = generateEdgelist(labels, data_asArrays, threshold);
            console.log(edgeList);

            // Generate proper nodeList
            labels.forEach(d => {
                nodes.push({'id': d})
            });
            console.log(nodes);

            // Run simulation
            simulation = forceSimulation(nodes)
                .alphaTarget(0.02)    //Make iterations run forever
                .alphaDecay(0)
                .velocityDecay(120/nodes.length - 0.08)    //Speed of node movement based on nr of nodes.
                .force("link", forceLink(edgeList).id(d => d.id))
                .force("charge", forceManyBody())
                .force("collide", forceCollide())
                .force("center", forceCenter(width / 2, height / 2))
                .on("tick", () => {
                    console.log("ticked");
                });
        }      
    }

    // Functions
    function generateEdgelist(nodes, sourceMatrix, threshold) {

        const edgeList = [];
        for(let s = 0; s < sourceMatrix.length; s++) {
        for(let t = 0; t < sourceMatrix.length; t++) {
            const v = +sourceMatrix[s][t];
            if(v > threshold) {
            const edge = {source: nodes[s], target: nodes[t], value: v};
            edgeList.push(Object.assign(edge));
            } 
        }
        }
        return edgeList;
    }


</script>


<!-- Bug: attributes don't update -->
<svg width={width} height={height}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g class="edges">

        </g>
        <g class="nodes">
            {#if labels} 
                {#each nodes as node, i } 
                    <circle class="node"
                            cx={node.x}
                            cy={node.y}
                            r={radius}
                            fill={"black"}
                    />
                {/each}
            {/if}
        </g>
    </g>
</svg>