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
```R
library(json)
df_json = toJson(df)
write_json(df_json, "location/graph.json")
```

#### Python json formatter




## Examples
#### Multi Omics Exploration
* create an explorative view that will serve as a basis to identify potential disease-related medical parameters. 
* Be a hypothesis-generating tool that is expected to provide input for (more directionality focused) downstream analyses