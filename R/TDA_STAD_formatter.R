library(phyloseq)
library(stad)
library(igraph)
library(jsonlite)

data(enterotype)

meta_data = sample_data(enterotype)
abundance_table = data.frame(otu_table(enterotype))


# 1. Create distance matrices using phyloseq build-in distance function.
eucl_dist_sample = as.matrix(distance(otu_table(enterotype), method = "euclidean", type = "sample"))
bray_dist_sample = as.matrix(distance(otu_table(enterotype), method = "bray", type = "sample"))
can_dist_sample = as.matrix(distance(otu_table(enterotype), method = "canberra", type = "sample"))

eucl_dist_taxa = as.matrix(distance(otu_table(enterotype), method = "euclidean", type = "taxa"))
bray_dist_taxa = as.matrix(distance(otu_table(enterotype), method = "bray", type = "taxa"))
can_dist_taxa = as.matrix(distance(otu_table(enterotype), method = "canberra", type = "taxa"))

# delete col- and rownames because stad cannot process matrices with col- or rownames.
colnames(eucl_dist_sample) = NULL
rownames(eucl_dist_sample) = NULL
colnames(bray_dist_sample) = NULL
rownames(bray_dist_sample) = NULL
colnames(can_dist_sample) = NULL
rownames(can_dist_sample) = NULL

colnames(eucl_dist_taxa) = NULL
rownames(eucl_dist_taxa) = NULL
colnames(bray_dist_taxa) = NULL
rownames(bray_dist_taxa) = NULL
colnames(can_dist_taxa) = NULL
rownames(can_dist_taxa) = NULL

# generate STAD networks
set.seed(31)
sample_eucl_network = stad(eucl_dist_sample)
sample_bray_network = stad(bray_dist_sample)
sample_can_network = stad(can_dist_sample)

taxa_eucl_network = stad(eucl_dist_taxa)
taxa_bray_network = stad(bray_dist_taxa)
taxa_can_network = stad(can_dist_taxa)

# Nodes
samples = colnames(abundance_table)
taxa = rownames(abundance_table)

# Links
sample_links_eucl <- data.frame(as_edgelist(sample_eucl_network[["graph"]]))
sample_links_bray <- data.frame(as_edgelist(sample_bray_network[["graph"]]))
sample_links_can <- data.frame(as_edgelist(sample_can_network[["graph"]]))

taxa_links_eucl <- data.frame(as_edgelist(taxa_eucl_network[["graph"]]))
taxa_links_bray <- data.frame(as_edgelist(taxa_bray_network[["graph"]]))
taxa_links_can <- data.frame(as_edgelist(taxa_can_network[["graph"]]))

## change col names to source and target as this naming is required for the tool.
colnames(sample_links_eucl) <- c("source", "target")
colnames(sample_links_bray) <- c("source", "target")
colnames(sample_links_can) <- c("source", "target")
colnames(taxa_links_eucl) <- c("source", "target")
colnames(taxa_links_bray) <- c("source", "target")
colnames(taxa_links_can) <- c("source", "target")

## change columns to characters -- but values are still id numbers.
sample_links_eucl$source = as.character(sample_links_eucl$source)
sample_links_eucl$target = as.character(sample_links_eucl$target)
sample_links_bray$source = as.character(sample_links_bray$source)
sample_links_bray$target = as.character(sample_links_bray$target)
sample_links_can$source = as.character(sample_links_can$source)
sample_links_can$target = as.character(sample_links_can$target)


# Link id numberss to link labels and add initial distance value
for (i in 1:length(sample_links_eucl$source)) {
  sample_links_eucl$value[i] = eucl_dist_sample[as.numeric(sample_links_eucl$source[i]),as.numeric(sample_links_eucl$target[i])]
  sample_links_eucl$source[i] = samples[as.numeric(sample_links_eucl$source[i])]
  sample_links_eucl$target[i] = samples[as.numeric(sample_links_eucl$target[i])]
}
for (i in 1:length(sample_links_bray$source)) {
  sample_links_bray$value[i] = bray_dist_sample[as.numeric(sample_links_bray$source[i]),as.numeric(sample_links_bray$target[i])]
  sample_links_bray$source[i] = samples[as.numeric(sample_links_bray$source[i])]
  sample_links_bray$target[i] = samples[as.numeric(sample_links_bray$target[i])]
}
for (i in 1:length(sample_links_can$source)) {
  sample_links_can$value[i] = can_dist_sample[as.numeric(sample_links_can$source[i]),as.numeric(sample_links_can$target[i])]
  sample_links_can$source[i] = samples[as.numeric(sample_links_can$source[i])]
  sample_links_can$target[i] = samples[as.numeric(sample_links_can$target[i])]
}
for (i in 1:length(taxa_links_eucl$source)) {
  taxa_links_eucl$value[i] = eucl_dist_taxa[as.numeric(taxa_links_eucl$source[i]),as.numeric(taxa_links_eucl$target[i])]
  taxa_links_eucl$source[i] = samples[as.numeric(taxa_links_eucl$source[i])]
  taxa_links_eucl$target[i] = samples[as.numeric(taxa_links_eucl$target[i])]
}
for (i in 1:length(taxa_links_bray$source)) {
  taxa_links_bray$value[i] = bray_dist_taxa[as.numeric(taxa_links_bray$source[i]),as.numeric(taxa_links_bray$target[i])]
  taxa_links_bray$source[i] = samples[as.numeric(taxa_links_bray$source[i])]
  taxa_links_bray$target[i] = samples[as.numeric(taxa_links_bray$target[i])]
}
for (i in 1:length(taxa_links_can$source)) {
  taxa_links_can$value[i] = can_dist_taxa[as.numeric(taxa_links_can$source[i]),as.numeric(taxa_links_can$target[i])]
  taxa_links_can$source[i] = samples[as.numeric(taxa_links_can$source[i])]
  taxa_links_can$target[i] = samples[as.numeric(taxa_links_can$target[i])]
}

# Graph

## Add metadata to nodes
NodeList_samples = data.frame(cbind('label' = samples, 'seqTech' = as.character(meta_data$SeqTech), 'nationality' = as.character(meta_data$Nationality), 'gender' = as.character(meta_data$Gender), 'age' = as.numeric(as.character(meta_data$Age)), 'clinicalStatus' = as.character(meta_data$ClinicalStatus)))

## generate and write data to .json
graph_sample_eucl = toJSON(list(nodes = NodeList_samples, links = sample_links_eucl), pretty = TRUE)
write_json(fromJSON(graph_sample_eucl), "data/phyloseq_example_data/sample_network_eucl.json")

graph_sample_bray = toJSON(list(nodes = NodeList_samples, links = sample_links_bray), pretty = TRUE)
write_json(fromJSON(graph_sample_bray), "data/phyloseq_example_data/sample_network_bray.json")


graph_sample_can = toJSON(list(nodes = NodeList_samples, links = sample_links_can), pretty = TRUE)
write_json(fromJSON(graph_sample_can), "data/phyloseq_example_data/sample_network_can.json")
