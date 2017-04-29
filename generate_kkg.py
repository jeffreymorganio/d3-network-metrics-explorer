#!/usr/bin/env python

import json

import networkx as nx

# Create the KKG network with NetworkX
kkg = nx.generators.small.krackhardt_kite_graph()

# Calculate centrality measures for the KKG network with NetworkX
centrality_measures = {
    'degree': nx.degree_centrality(kkg),
    'betweenness': nx.betweenness_centrality(kkg),
    'closeness': nx.closeness_centrality(kkg),
    'eigenvector': nx.eigenvector_centrality(kkg),
}

# Output the array of centrality measure names in JSON format
with open('centrality-measures.json', 'w') as f:
    json.dump(list(centrality_measures.keys()), f, indent=2)

# Create the basic structure of a force-directed D3 network
d3_graph = {
    'nodes': [],
    'links': [],
}

# Add each node in the KKG network to the D3 network
for node in kkg.nodes():
    d3_graph_node = {
        'id': str(node),
        'centrality': {},
    }
    for centrality_measure in centrality_measures:
        d3_graph_node['centrality'][centrality_measure] = centrality_measures[centrality_measure][node]
    d3_graph['nodes'].append(d3_graph_node)

# Add each edge in the KKG network to the D3 network
for (source, target) in kkg.edges():
    d3_graph_edge = {
        'source': str(source),
        'target': str(target)
    }
    d3_graph['links'].append(d3_graph_edge)

# Output the network graph in JSON format
with open('kkg.json', 'w') as f:
    json.dump(d3_graph, f, indent=2)
