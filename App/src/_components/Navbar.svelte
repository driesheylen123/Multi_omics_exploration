<script>

    import { toggle_sidebar } from '../stores.js';

    const _dataFormat = JSON.stringify({nodes: [{id: 0,label: "node_A"},{id: 1,label: "node_B"}],links: [{source: "node_A",target: "node_B",value: "1"}]}, null, '\t');
    hljs.initHighlightingOnLoad();

</script>

<nav class="navbar navbar-expand-lg justify-content-between navbar-light bg-transparent py-4 px-4">
    <div class="d-flex align-items-center">
        <i class="fas fa-align-left text-dark fs-4 me-3" id="menu-toggle" on:click={() => $toggle_sidebar = !$toggle_sidebar}></i>			
    </div>

    <div class="d-flex align-items-center">
        <button type="button" class="btn btn-link link-text me-3" data-bs-toggle="modal" data-bs-target="#exampleModalLong">Docs</button>
        <a href="https://github.com/driesheylen123/Multi_omics_exploration" target="_blank" rel="noopener noreferrer" class="d-flex align-items-center link-text">
            <i class="fab fa-github"></i>
        </a>

        <!-- Modal -->
        <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="exampleModalLongTitle">MOBS - Multi-Omics Brush for Subgraph visualisation</h3>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h4>Abstract</h4>
                    <p>One of big opportunities in multi-omics analysis is the identification of interactions between molecular entities and their association with diseases. In analyzing and expressing these interactions in the search for new hypotheses, multi-omics data is often either translated into matrices containing pairwise correlations and distances, or visualized as node-link diagrams. A major problem when visualizing large networks however is the occurrence of hairball-like graphs, from which little to none information can be extracted. It is of interest to investigate subgroups of markers that are closely associated with each other, rather than just looking at the overload of all interactions. An interface that draws subnetworks based on user interaction greatly helps in enabling comprehensible, detailed analyses.</p>
                    <h4>User interface</h4>
                    <p>MOBS was designed with various functionalities that enable efficient analyses, and includes several interactive features to optimize the user experience.</p>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Buttons</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Run</td>
                                <td>Start simulation algorithm<sup>1</sup> and draw visualisations.</td>
                            </tr>
                            <tr>
                                <td>Pause</td>
                                <td>Pause simulation algorithm<sup>1</sup> to keep current layout in the node-link diagram (Graph).</td>
                            </tr>
                            <tr>
                                <td>Reset</td>
                                <td>Remove the visualizations from the screen en reset the simulation algorithm<sup>1</sup>.</td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th>Clustering</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Select clustering</td>
                                <td>Select the type of hierarchical clustering you want to apply on the data. Options include: single, complete, and average. Default is none.</td>    
                            </tr>
                            <tr>
                                <td>Threshold clustering</td>
                                <td>Select the clustering depth that clusters can be formed in.</td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th>Matrix Styling</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Domain colorscale</th>
                            </tr>
                            <tr>
                                <td>Min value</td>
                                <td>Define minimum value for the domain of the color scale applied on edge values (weights).</td>
                            </tr>
                            <tr>
                                <td>Center value</td>
                                <td>Define center value for the domain of the color scale applied on edge values (weights).</td>
                            </tr>
                            <tr>
                                <td>Max value</td>
                                <td>Define maximum value for the domain of the color scale applied on edge values (weights).</td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th>Graph Styling</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Nodes</th>
                            </tr>
                            <tr>
                                <td>Radius</td>
                                <td>Define node radius.</td>
                            </tr>
                            <tr>
                                <td>Color variable</td>
                                <td>Select variable to use for node coloring.</td>
                            </tr>
                            <tr>
                                <th>Edges</th>
                            </tr>
                            <tr>
                                <td>Width</td>
                                <td>Define edge width.</td>
                            </tr>
                            <tr>
                                <td>Color variable</td>
                                <td>Select variable to use for link coloring.</td>
                            </tr>
                        </tbody>
                    </table>
                    <sup id="fn1">1. The simulation algorithm calculates the optimal position of the nodes based on a set of predefined forces, and hence determines the layout of the node-link diagram by constantly repositioning the nodes untill saturation is reached.</sup>
                    <h4>Data requirements</h4>
                    <p>The input data needs to be off the format <code>.json</code>, and contains the following arrays with values:</p>
                    <!-- <div class="code-block json" bind:this={code_block_json}></div> -->
                    <pre>
                        <code class="json">
                            {_dataFormat}
                        </code>
                    </pre>
                    <h6>R json formatter</h6>
                    <p>In R, the <code>jsonlite</code> package allows us to use the function <code>toJSON()</code> and <code>fromJSON</code> to parse JSON formats. Using <code>write_json(fromJSON(toJSON(df)), "C:/location/df.json")</code>, we can write any dataframe to <code>.json</code>. Here is an example of how to transform a correlation matrix into a node link diagram and store it as a <code>.json</code> file:</p>
                    <pre>
                        <code class="r">{`
# Load Data
data(mtcars)

# Compute correlation matrix
correlation_matrix = cor(mtcars)

# Generate edge list
links = data.frame("source" = character(), 
                   "target" = character(), 
                   "value" = integer(), 
                   stringsAsFactors = FALSE)
i = 0
for(s in colnames(correlation_matrix)) {
  for(t in colnames(correlation_matrix)) {
    links[i,c("source")] = s 
    links[i,c("target")] = t
    links[i,c("value")] = correlation_matrix[c(s),c(t)]
    i = i + 1
  }
}

# Generate node list
nodes = data.frame(id = seq(from=0, to=length(colnames(correlation_matrix))-1, by=1), 
                   label = colnames(correlation_matrix), 
                   stringsAsFactors = FALSE)

# Generate node link file
graph = list(nodes = nodes, links = links)

library(jsonlite)
graph_json = toJSON(graph, pretty = TRUE)
write_json(fromJSON(graph_json), "C:/location/example.json")`}
                        </code>
                    </pre>
                    <h6>Python json formatter</h6>
                    <p>In Python, we can use <code>pandas</code> to transform dataframes into dictionaries, using <code>to_dict()</code>. Hence, <code>json</code> formats are easy to construct and can be stored in a local <code>.json</code> file using <code>json.dump()</code>. Here is an example of how to transform a correlation matrix into a node link diagram and store it as a <code>.json</code> file:</p>
                    <pre>
                        <code class="python">{`
import pandas as pd
import seaborn as sns
import numpy as np
import json

# Load Data
df = sns.load_dataset('iris')

# Compute correlation matrix
correlation_matrix = df[["sepal_length", "sepal_width", "petal_length", "petal_width"]].corr()

# Generate edge list
links = correlation_matrix.stack().reset_index()
links.columns = ["source", "target", "value"]

# Generate node list
nodes = pd.DataFrame(data={'id': np.arange(len(correlation_matrix.columns), dtype=int), 
                           'label': list(correlation_matrix.columns)})

# Generate node link file
graph = {'nodes': nodes.to_dict(orient='records'), 'links': links.to_dict(orient='records')}

with open('example.json', 'w') as f:
    json.dump(graph, f)`}
                        </code>
                    </pre>                
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>
    </div>
</nav>

<style>
    .link-text, .link-text:hover, .link-text:focus, .link-text:active {
        text-decoration: none;
        color: #292b2c;
    }
    #menu-toggle {
        cursor: pointer;
    }
</style>