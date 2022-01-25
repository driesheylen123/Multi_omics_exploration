# Network Brush
A major problem within network visualization is the occurance of hairball like graphs, from which little to none information can be extracted. Network brush is a tool that allows you to dive deeper in big dense networks. Node link data is visualized both as an adjacency matrix and a traditional node link diagram. By adding a two dimensional brush on the adjacency matrix, this tool can be used to visualize smaller sub-graphs of the network, allowing the user to gain more insight in specific parts of the network.

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
In R, the `jsonlite` library allows us to use the function `toJSON()` and `fromJSON` to parse JSON formats. Using `write_json(fromJSON(toJSON(df)), "C:/location/df.json")`, we can write any dataframe to `.json`. Here is an example of how to transform a correlation matrix into a node link diagram and store it as a `.json` file:
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




## Examples
#### Multi Omics Exploration
* create an explorative view that will serve as a basis to identify potential disease-related medical parameters. 
* Be a hypothesis-generating tool that is expected to provide input for (more directionality focused) downstream analyses