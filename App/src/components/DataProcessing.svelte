<script>
    import { csv } from 'd3';
    import { setContext } from 'svelte';
    import { derived, writable } from 'svelte/store';
    import { threshold } from '../stores.js'

    const dataset = writable([]);

	csv('data/protein_network_correlation_big.csv', function(row) {
        // Data prep: each row is originally an object, but needs to be an array. 
        // Hence, we extract all column values for each row and store these in an array.
        // The first value contains the row name, so we remove this value.
        let row_asArray = Object.values(row);
        row_asArray.shift();    // 
        return row_asArray;
    }).then(function(data) {
        // Remove empty column value
        data.columns.shift();
		$dataset = data;
	});

    const nodes = derived(dataset, ($dataset) => {
        if ($dataset.length > 0) {
            return $dataset.columns.map(d => {
                return {'id': $dataset.columns.indexOf(d), 'label': d};
            })
        } else {
            return [];
        }
    });

    const edges = derived([dataset,nodes,threshold], ([$dataset, $nodes, $threshold]) => {
        return generateEdgelist($nodes, $dataset, $threshold);
    })

    const matrixEdges = derived([dataset,nodes], ([$dataset, $nodes]) => {
        return generateMatrixEdgelist($nodes, $dataset);
    })

    setContext('data', {
        dataset, nodes, edges, matrixEdges  
    });

    // $:console.log($dataset);
    // $:console.log($nodes);
    // $:console.log($edges);

    // Functions
    function generateEdgelist(nodes, dataset, threshold) {
        const edgeList = [];
        for(let rowIndex = 0; rowIndex < dataset.length; rowIndex++) {
            const row = dataset[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const v = +row[colIndex];
                if (v > threshold) {
                    const edge = {source: nodes[rowIndex].label, target: nodes[colIndex].label, value: v};
                    edgeList.push(edge);
                }
            }
        }
        return edgeList;
    }
    function generateMatrixEdgelist(nodes, dataset) {
        const edgeList = [];
        for(let rowIndex = 0; rowIndex < dataset.length; rowIndex++) {
            const row = dataset[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const v = +row[colIndex];
                const edge = {source: nodes[rowIndex].label, target: nodes[colIndex].label, value: v};
                edgeList.push(edge);
            }
        }
        return edgeList;
    }

</script>

<slot/>