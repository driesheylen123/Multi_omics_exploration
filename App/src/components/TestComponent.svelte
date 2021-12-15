<!-- <script>

    let data = [[1,2,3,4,5,6,7,8,9,10],
                [2,3,4,5,6,7,8,9,10,1],
                [3,4,5,6,7,8,9,10,1,2],
                [4,5,6,7,8,9,10,1,2,3],
                [5,6,7,8,9,10,1,2,3,4],
                [6,7,8,9,10,1,2,3,4,5],
                [7,8,9,10,1,2,3,4,5,6],
                [8,9,10,1,2,3,4,5,6,7],
                [9,10,1,2,3,4,5,6,7,8],
                [10,1,2,3,4,5,6,7,8,9]];

    let matrix = druid.Matrix.from(data);

    console.log('-- DruidJS Matrix --');
    console.log(matrix);
    console.log('-- 2D Matrix via to2dArray --');
    console.log(matrix.to2dArray);

    let cl1 = new druid.Hierarchical_Clustering(matrix, "complete", "precomputed");
    console.log('-- HC Output --');
    console.log(cl1);

    let order = cl1.root.leaves().map(d => d.index);
    console.log('-- Order --');
    console.log(order);
    console.log(cl1.root.index);
    

</script> -->


<!-- <script>

    import { getContext } from 'svelte';

    const {labels, dataset} = getContext('data');

    let data_asArrays = [];
    let current;
    let matrix;
    $:{
        console.log($dataset);
        $dataset.forEach((d) => {
            current = Object.values(d);
            current.shift();
            data_asArrays.push(current);
        });
        console.log(data_asArrays);
        
        if (data_asArrays.length > 0) {
            matrix = druid.Matrix.from(data_asArrays);
            console.log(matrix);

            let cl1 = new druid.Hierarchical_Clustering(matrix, "complete", "precomputed");
            console.log('-- HC Output --');
            console.log(cl1);

            let order = cl1.root.leaves().map(d => d.index);
            console.log('-- Order --');
            console.log(order);

            // let labelsReordered = $labels.sort(function (a,b) {
            //     return order.indexOf($labels.indexOf(a)) - order.indexOf($labels.indexOf(b));
            // });
            // console.log(labelsReordered);
            
        }
    }
    

</script> -->

<script>
    import { clustering } from '../druid.js'
    import { getContext } from 'svelte';

    const {labels, dataset} = getContext('data');

    $:{
        if ($dataset.length > 0) {
            let order = clustering($dataset, "complete");
            $labels.sort((a,b) => {
                return order.indexOf($labels.indexOf(a)) - order.indexOf($labels.indexOf(b))
            });
            console.log($labels);
        }
    }

</script>