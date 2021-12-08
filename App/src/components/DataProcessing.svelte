<script>
    import { csv } from 'd3';
    import { setContext } from 'svelte';
    import { derived, writable } from 'svelte/store';

    const threshold = writable(.3);
    const dataset = writable([]);

	csv('data/protein_network_correlation_big.csv').then(function(data) {
		$dataset = data;
	});

    const labels = derived(dataset, ($dataset) => {
        let organisms = $dataset.columns || [];
        organisms.shift()
        return organisms;
    });

    const nodes = derived(labels, ($labels) => {
        return $labels.map(d => {
            return {'id': d}
        });
    });

    const edges = derived([dataset,labels,threshold], ([$dataset, $labels, $threshold]) => {
        return generateEdgelist($labels, $dataset, $threshold);
    })

    setContext('threshold', {threshold});
    setContext('data', {
        labels, nodes, edges, dataset 
    });

    // $:console.log($dataset);
    // $:console.log($nodes);
    // $:console.log($edges);

    // Functions
    function generateEdgelist(labels, dataset, threshold) {
        const edgeList = [];
        for(let rowIndex = 0; rowIndex < dataset.length; rowIndex++) {
            const row = dataset[rowIndex];
            for(const colName in row) {
                if(colName !== "") {
                    const v = +row[colName];
                    if(v > threshold) {
                        const edge = {source: labels[rowIndex], target: colName, value: v};
                        edgeList.push(edge);
                    } 
                }
            }
        }
        return edgeList;
    }

</script>

<slot/>