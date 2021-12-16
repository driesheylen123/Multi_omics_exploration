export function clustering(data, linkage) {

    // Transform into druidjs matrix object
    let matrix = druid.Matrix.from(data);

    // Do Hierarchical clustering
    let H = new druid.Hierarchical_Clustering(matrix, linkage, "precomputed");
            
    // Return New order
    return H.root.index;
               
}
