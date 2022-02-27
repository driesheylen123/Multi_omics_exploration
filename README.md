# MOBS - Multi-Omics Brush for Subgraph visualisation
One one of the big opportunities in multi-omics analysis is the identification of interactions between molecular entities and their
association with diseases. In analyzing and expressing these interactions in the search for new hypotheses, multi-omics data
is often either translated into matrices containing pairwise correlations and distances, or visualized as node-link diagrams. A
major problem when visualizing large networks however is the occurrence of hairball-like graphs, from which little to none
information can be extracted. It is of interest to investigate subgroups of markers that are closely associated with each other,
rather than just looking at the overload of all interactions. An interface that draws subnetworks based on user interaction
greatly helps in enabling comprehensible, detailed analyses.

## Running the app online
The application is available online, and can be accessed at: [https://mobs.vercel.app/](https://mobs.vercel.app/).

## Running the app locally
This project is developped in the JavaScript framework [Svelte](https://svelte.dev). To run this application locally, clone the repository to a directory on your computer. *Note that you will need to have [Node.js](https://nodejs.org) installed.*

1. Open the terminal/command promt on your pc.
2. change the directory to the folder you want to store the application in.
```bash
cd Documents\Multi-Omics-Exploration-Tool
```
3. Clone this GitHub repository into your folder.
```bash
git clone https://github.com/driesheylen123/Multi_omics_exploration.git
```
4. The repository includes additional scripts and data generated in the example use case for the paper. The actual application is located in the 'App' directory. Hence, 
change the directory to the 'App' folder within the repository.
```bash
cd Multi-Omics-Exploration-Tool\App
```
5. Install all necessary dependencies. *Make sure [Node.js](https://nodejs.org) is installed on your device*
```bash
npm install
```
6. Run the application
```bash
npm run start
```
7. Navigate to [localhost:5000](http://localhost:5000). You should now see the app running.

## Data requirements
The input data needs to be off the format `.json`, and contains the following arrays with values:
```Javascript
{
    nodes: [
        {
            id: 0,
            label: "node_A",
        },
        {
            id: 1,
            label: "node_B",
        },
    ],
    links: [
        {
            source: "node_A",
            target: "node_B",
            value: "1",
        }
    ]
}
```

#### R json formatter
In R, the `jsonlite` package allows us to use the function `toJSON()` and `fromJSON` to parse JSON formats. Using `write_json(fromJSON(toJSON(df)), "C:/location/df.json")`, we can write any dataframe to `.json`. Here is an example of how to transform a correlation matrix into a node link diagram and store it as a `.json` file:
```R
# Load Data
data(mtcars)

# Compute correlation matrix
correlation_matrix = cor(mtcars)

# Generate edge list
links = data.frame("source" = character(), "target" = character(), "value" = integer(), stringsAsFactors = FALSE)
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
write_json(fromJSON(graph_json), "C:/location/example.json")
```

#### Python json formatter
In Python, we can use `pandas` to transform dataframes into [dictionaries](https://www.w3schools.com/python/python_dictionaries.asp), using `to_dict()`. Hence, `json` formats are easy to construct and can be stored in a local `.json` file using `json.dump()`. Here is an example of how to transform a correlation matrix into a node link diagram and store it as a `.json` file:
```Python
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
nodes = pd.DataFrame(data={'id': np.arange(len(correlation_matrix.columns), dtype=int), 'label': list(correlation_matrix.columns)})

# Generate node link file
graph = {'nodes': nodes.to_dict(orient='records'), 'links': links.to_dict(orient='records')}

with open('example.json', 'w') as f:
    json.dump(graph, f)
```



## Examples
#### Multi Omics Exploration
* Create an explorative view that will serve as a basis to identify potential disease-related medical parameters. 
* Be a hypothesis-generating tool that is expected to provide input for (more directionality focused) downstream analyses
