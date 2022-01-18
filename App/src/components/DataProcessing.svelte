<script>
    
    import { setContext } from 'svelte';
    import { derived, writable } from 'svelte/store';
    import { input_file, threshold } from '../stores.js'

    const dataset = writable([]);
    $: {
        if ($input_file.length > 0) {
            console.log('Running');
            $input_file.forEach(element => {
                element = Object.values(element);
                element.shift();
                $dataset.push(element);
            });
            $input_file.columns.shift();
            $dataset.columns = $input_file.columns;
            console.log($dataset);
        }
    }

    const nodes = derived(dataset, ($dataset) => {
        if ($dataset.length > 0) {
            return $dataset.columns.map(d => {
                return {'id': $dataset.columns.indexOf(d), 'label': d};
            })
        } else {
            return [];
        }
    });

    const edges = derived([nodes,dataset,threshold], ([$nodes, $dataset, $threshold]) => {
        return generateEdgelist($nodes, $dataset, $threshold);
    })

    const matrixEdges = derived([nodes,dataset], ([$nodes, $dataset]) => {
        return generateEdgelist($nodes, $dataset, 0);
    })

    setContext('data', {
        dataset, nodes, edges, matrixEdges  
    });

    // $:console.log($dataset);
    // $:console.log($nodes);
    // $:console.log($edges);
    // $:console.log($matrixEdges);

    // Functions
    function generateEdgelist(nodes, dataset, threshold) {
        const edgeList = [];
        for(let rowIndex = 0; rowIndex < dataset.length; rowIndex++) {
            const row = dataset[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const v = +row[colIndex];
                if (Math.abs(v) > threshold) {
                    if (nodes[rowIndex].label !== nodes[colIndex].label) {
                        const edge = {source: nodes[rowIndex].label, target: nodes[colIndex].label, value: v};
                        edgeList.push(edge);
                    }
                }
            }
        }
        return edgeList;
    }

</script>

<slot/>