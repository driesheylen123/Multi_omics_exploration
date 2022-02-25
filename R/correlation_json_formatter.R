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