library(dplyr)
library(devtools)
library(tidyverse)
#Network_prep <- MOFA_conceptual_test %>% pivot_wider(names_from = feature, values_from = value)

#load Network_prep.csv into R
Network_prep <- head(Network_prep,-1)


Network_prep <- Network_prep[1:152]
Network_prep$view <- NULL 
rownames = Network_prep$sample
Network_prep$sample = NULL
row.names(Network_prep) = rownames
#to check type of each column
sapply(Network_prep, class)                           # Get classes of all columns

#converting each column to numeric value
# Specify columns you want to change
i <- c(1:150)  
Network_prep[ , i] <- apply(Network_prep[ , i], 2,            # Specify own function within apply
                    function(x) as.numeric(as.character(x)))


#compute correlation
Network_prep_corr <- cor(Network_prep, method = c("pearson"))
#remove na.omit 
Network_prep_corr <- na.omit(Network_prep_corr)

write.csv(Network_prep_corr, "protein_network_correlation_big.csv")


#colnames(Network_prep)
#labels <- as.list(colnames(Network_prep))
getwd()
