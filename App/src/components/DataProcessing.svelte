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

    const labels = derived(dataset, ($dataset) => {
        return $dataset.columns || [];
    });

    const nodes = derived(labels, ($labels) => {
        return $labels.map(d => {
            return {'id': d}
        });
    });

    const edges = derived([dataset,labels,threshold], ([$dataset, $labels, $threshold]) => {
        return generateEdgelist($labels, $dataset, $threshold);
    })

    const matrixEdges = derived([dataset,labels], ([$dataset, $labels]) => {
        return generateMatrixEdgelist($labels, $dataset);
    })

    setContext('data', {
        dataset, labels, nodes, edges, matrixEdges  
    });

    // $:console.log($dataset);
    // $:console.log($labels);
    // $:console.log($nodes);
    // $:console.log($edges);

    // Functions
    function generateEdgelist(labels, dataset, threshold) {
        const edgeList = [];
        for(let rowIndex = 0; rowIndex < dataset.length; rowIndex++) {
            const row = dataset[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const v = +row[colIndex];
                if (v > threshold) {
                    const edge = {source: labels[rowIndex], target: labels[colIndex], value: v};
                    edgeList.push(edge);
                }
            }
        }
        return edgeList;
    }
    function generateMatrixEdgelist(labels, dataset) {
        const edgeList = [];
        for(let rowIndex = 0; rowIndex < dataset.length; rowIndex++) {
            const row = dataset[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const v = +row[colIndex];
                const edge = {source: labels[rowIndex], target: labels[colIndex], value: v};
                edgeList.push(edge);
            }
        }
        return edgeList;
    }

</script>

<slot/>