function createNetworkVisualization(error, graph, centralityMeasures) {
  if (error) throw error;

  var width = 580,
      height= 320;

  var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", function() {
      highlightNode(null);
    });

  circleSize = { min: 5, max: 40 };
  var circleRadiusScale = d3.scaleSqrt()
    .domain([0, 1])
    .range([circleSize.min, circleSize.max]);

  var formatCentrality = d3.format(".2");

  var links = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("id", function(d) { return "link-" + d.source + "-" + d.target; });

  var nodes = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .on("click", function(d) {
        highlightNode(d);
      });
  nodes.append("title");

  updateCentralityMeasure(centralityMeasures[0]);
  createForceSimulation();
  createCentralityControls();
  createCentralityTable();

  function updateCentralityMeasure(centralityMeasure) {
    nodes
      .transition()
      .duration(250)
      .attr("r", function(d) { return circleRadiusScale(d.centrality[centralityMeasure]); });

    nodes.selectAll("title")
      .text(function(d) { return formatCentrality(d.centrality[centralityMeasure]); });
  }

  function createForceSimulation() {
    var forceSimulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(function(d) { return circleSize.max*1.25; }))
      .nodes(graph.nodes)
      .on("tick", tick);

    forceSimulation.force("link")
      .links(graph.links);

    function tick() {
      nodes
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
      links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    }
  }

  function createCentralityControls() {
    var spans = d3.select("#controls")
      .selectAll("span")
      .data(centralityMeasures)
      .enter()
      .append("span");

    spans.append("input")
      .attr("id", function(d) { return d; })
      .attr("type", "radio")
      .attr("name", "centrality")
      .attr("value", function(d) { return d; })
      .property("checked", function(d, i) { return i === 0; })
      .on("click", function(d) { updateCentralityMeasure(d); });

    spans.append("label")
      .attr("for", function(d) { return d; })
      .text(function(d) { return titleCase(d); });
  }

  function titleCase(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function createCentralityTable() {
    var table = d3.select("table")
      .style("width", width);

    var columnNames = ["Node"].concat(centralityMeasures);
    table.append("thead")
      .append("tr")
      .selectAll("th")
      .data(columnNames)
      .enter()
        .append("th")
        .text(function(d) { return titleCase(d); });

    var rows = table.append("tbody")
      .selectAll("tr")
      .data(graph.nodes, function(d) { return d.id; })
      .enter()
      .append("tr")
        .attr("id", function(d) { return "row-" + d.id; });

    rows.selectAll('td')
      .data(function(node) {
        var measures = centralityMeasures.map(function(centralityMeasure) {
          return formatCentrality(node.centrality[centralityMeasure]);
        });
        return [node.id].concat(measures);
      })
      .enter()
      .append("td")
        .text(function(d) { return d; });

    rows
      .on("mouseover", function(d) { highlightNode(d); })
      .on("mouseout", function(d) { highlightNode(null); });
  }

  function highlightNode(node) {
    highlightCircle(node);
    highlightTableRow(node);
    highlightAdjacentLinks(node);
    d3.event.stopPropagation();

    function highlightCircle(node) {
      highlightElement(".nodes circle", node);
    }

    function highlightTableRow(node) {
      highlightElement("tbody tr", node);
    }

    function highlightElement(selector, node) {
      var elements = d3.selectAll(selector);
      elements.classed("highlight", false);
      if (node) elements.classed("highlight", function(d) { return d.id === node.id; });
    }

    function highlightAdjacentLinks(node) {
      var linkIDs = graph.links.map(createLinkID);
      var adjacentLinks = adjacentLinksFrom(node);
      var adjacentLinkIDs = adjacentLinks.map(createLinkID);

      linkIDs.forEach(function(linkID) {
        d3.select(linkID)
          .classed("highlight", adjacentLinkIDs.indexOf(linkID) !== -1);
      });

      function createLinkID(link) {
        return "#link-" + link.source.id + "-" + link.target.id;
      }

      function adjacentLinksFrom(node) {
        var links = [];
        if (!node) return links;
        graph.links.forEach(function(link) {
          if (node.id === link.source.id || node.id === link.target.id) {
            links.push(link);
          }
        });
        return links;
      }
    }
  }

}
