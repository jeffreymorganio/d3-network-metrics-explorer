# D3 Network Metrics Explorer

This project builds a coordinated network and table visualization with Python and [D3](https://d3js.org/) for exploring various network centrality measures.

<div>
  <img src="http://jeffreymorganio.github.io/d3-network-metrics-explorer/d3-network-metrics-explorer.png" alt="Combined/Colors">
</div>

Watch the [D3 Network Metrics Explorer](https://youtu.be/Z5J10UfH4rA) video on YouTube. Try the [live demo](https://jeffreymorganio.github.io/d3-network-metrics-explorer/demo/).

# Python

## Building the Network

The `generate_kkg.py` script builds a [Krackhardt Kite Graph](http://networkx.readthedocs.io/en/stable/reference/generated/networkx.generators.small.krackhardt_kite_graph.html) network with the [NetworkX](https://networkx.github.io/) Python library. The network is written to the 'kkg.json' file in a standard format used to create [force-directed networks](https://bl.ocks.org/mbostock/4062045) in D3:

```
{
  "nodes": [
    {
      "id": "0",
      "centrality": {
        "degree": 0.4444444444444444,
        "betweenness": 0.023148148148148143,
        "closeness": 0.5294117647058824,
        "eigenvector": 0.35220918419838565
      }
    },
    ...
  ],
  "links": [
    {
      "source": "0",
      "target": "1"
    },
    ...
  ]
}
```

## Calculating the Network Metrics

The KKG is a simple, ten-node network used to [demonstrate various network metrics](http://www.casos.cs.cmu.edu/events/summer_institute/2006/reading_list/krackhardt/Assessing_Political_Landscape.pdf). NetworkX calculates the following centrality metrics for the KKG network:

* [Degree](http://networkx.readthedocs.io/en/stable/reference/generated/networkx.algorithms.centrality.degree_centrality.html)
* [Betweenness](http://networkx.readthedocs.io/en/stable/reference/generated/networkx.algorithms.bipartite.centrality.betweenness_centrality.html)
* [Closeness](http://networkx.readthedocs.io/en/stable/reference/generated/networkx.algorithms.centrality.closeness_centrality.html)
* [Eigenvector](http://networkx.readthedocs.io/en/stable/reference/generated/networkx.algorithms.centrality.eigenvector_centrality.html)

The centrality metrics for each node are stored in the `centrality` object of the node in the JSON network file, as illustrated above.

The `generate-kkg.py` script also outputs an array of the centrality measure names in `centrality-measures.json`:

```
[
  "degree",
  "betweenness",
  "closeness",
  "eigenvector"
]
```

D3 uses this list to create the radio buttons that control the currently selected centrality measure and to name the columns of the network metrics table, as described below.

# D3

D3 inputs the network graph (`kkg.json`) and the list of centrality measure names (`centrality-measures.json`) and builds coordinated network and table views for exploring the four network centrality measures of the KKG.

## Visualizing the Network

A set of radio buttons built with D3 using the array of centrality measure names in `centrality-measures.json` control the currently selected network metric: degree, betweenness, closeness and eigenvector.

The network view is created with a [D3 force-directed](https://bl.ocks.org/mbostock/4062045) layout. The area of each node represents the centrality value of the node for the currently selected metric.

## Tabulating the Network Metrics

The tabular view of the network metrics is built with D3 using the centrality measure values for each node in `kkg.json` to populate the table and the array of centrality measure names in `centrality-measures.json` to name the columns.

## Coordinating the Views

Mousing over a table row highlights the row and highlights the corresponding node in the network graph. Similarly, clicking a node in the network highlights the corresponding table row.

The node and row highlighting is implemented by adding and removing the `highlight` CSS class that specifies a 100ms transition to smooth the change.

# Building

The `centrality-measures.json` and `kkg.json` files are included in this repo. To regenerate them, first install the NetworkX Python library:

```
pip install networkx
```

and then run the `generate_kkg.py` script.
