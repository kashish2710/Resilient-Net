
import { useEffect, useRef } from "react";
import * as d3 from "d3";

function NetworkGraph({
  data,
  selectedNode,
  setSelectedNode
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const width = 800;
    const height = 650;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");


    // =========================================
    // SCALE
    // =========================================

    const xScale = d3
      .scaleLinear()
      .domain([0, 500])
      .range([50, width - 50]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 500])
      .range([50, height - 50]);


    // =========================================
    // PREDICTION MAP
    // =========================================

    const predictionMap = new Map(
      data.predictions.map(p => [
        Number(p.node_id),
        p
      ])
    );


    // =========================================
    // NODE MAP
    // =========================================

    const nodeMap = new Map(
      data.nodes.map(node => [
        Number(node.node_id),
        node
      ])
    );


    // =========================================
    // ATTENTION MAP
    // =========================================

    const attentionMap = new Map();

    data.attention.forEach(edge => {

      const source = Number(edge.source);
      const target = Number(edge.target);

      const key1 = `${source}-${target}`;
      const key2 = `${target}-${source}`;

      const value = Number(edge.attention);

      attentionMap.set(key1, value);
      attentionMap.set(key2, value);

    });


    // =========================================
    // GRID
    // =========================================

    const grid = svg
      .append("g")
      .attr("class", "grid");

    for (let x = 0; x <= 500; x += 50) {

      grid
        .append("line")
        .attr("x1", xScale(x))
        .attr("y1", 0)
        .attr("x2", xScale(x))
        .attr("y2", height)
        .attr("stroke", "#243247")
        .attr("stroke-width", 1)
        .attr("opacity", 0.35);

    }

    for (let y = 0; y <= 500; y += 50) {

      grid
        .append("line")
        .attr("x1", 0)
        .attr("y1", yScale(y))
        .attr("x2", width)
        .attr("y2", yScale(y))
        .attr("stroke", "#243247")
        .attr("stroke-width", 1)
        .attr("opacity", 0.35);

    }


    // =========================================
    // COMMUNICATION RANGE
    // =========================================

    const rangeGroup = svg
      .append("g")
      .attr("class", "ranges");

    data.nodes.forEach(node => {

      rangeGroup
        .append("circle")
        .attr(
          "cx",
          xScale(Number(node.x))
        )
        .attr(
          "cy",
          yScale(Number(node.y))
        )
        .attr("r", 35)
        .attr("fill", "none")
        .attr("stroke", "#34445c")
        .attr("stroke-dasharray", "3 5")
        .attr("opacity", 0.25);

    });


    // =========================================
    // EDGES
    // =========================================

    const links = data.edges.map(edge => ({
      source: Number(edge.source),
      target: Number(edge.target)
    }));


    const edgeGroup = svg
      .append("g")
      .attr("class", "edges");


    const edgeLines = edgeGroup
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")

      .attr(
        "x1",
        d => xScale(nodeMap.get(d.source).x)
      )

      .attr(
        "y1",
        d => yScale(nodeMap.get(d.source).y)
      )

      .attr(
        "x2",
        d => xScale(nodeMap.get(d.target).x)
      )

      .attr(
        "y2",
        d => yScale(nodeMap.get(d.target).y)
      )

      .attr("stroke", "#53657d")

      .attr("stroke-width", 1.2)

      .attr("opacity", 0.45);


    // =========================================
    // NODES
    // =========================================

    const nodeGroup = svg
      .append("g")
      .attr("class", "nodes");


    const nodes = nodeGroup
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")

      .attr(
        "transform",
        d =>
          `translate(
            ${xScale(Number(d.x))},
            ${yScale(Number(d.y))}
          )`
      )

      .style("cursor", "pointer");


    // =========================================
    // NODE COLORS
    // =========================================

    nodes.each(function(node) {

      const group = d3.select(this);

      const nodeId =
        Number(node.node_id);

      const actual =
        Number(node.label);

      const prediction =
        predictionMap.get(nodeId);

      const predicted =
        prediction
          ? Number(prediction.prediction)
          : 0;


      const actualMalicious =
        actual === 1;

      const predictedMalicious =
        predicted === 1;


      let nodeColor = "#27e07f";


      // Actual malicious
      if (actualMalicious) {

        nodeColor = "#ff3b3b";

      }

      // False positive
      else if (predictedMalicious) {

        nodeColor = "#ffb020";

      }


      // =======================================
      // NODE CIRCLE
      // =======================================

      group
        .append("circle")
        .attr("class", "node-circle")
        .attr("r", 9)
        .attr("fill", nodeColor)
        .attr("stroke", nodeColor)
        .attr("stroke-width", 1.5);


      // =======================================
      // FALSE POSITIVE GLOW
      // =======================================

      if (
        !actualMalicious &&
        predictedMalicious
      ) {

        group
          .append("circle")
          .attr("r", 15)
          .attr("fill", "none")
          .attr("stroke", "#ffb020")
          .attr("stroke-width", 1)
          .attr("opacity", 0.25);

      }


      // =======================================
      // NODE ID
      // =======================================

      group
        .append("text")
        .text(nodeId)
        .attr("x", 0)
        .attr("y", 28)
        .attr("text-anchor", "middle")
        .attr("fill", "#cbd6e5")
        .attr("font-size", "11px");


      // =======================================
      // CLICK NODE
      // =======================================

      group.on("click", () => {

        setSelectedNode({
          ...node,

          prediction: predicted,

          normal_probability:
            prediction
              ? Number(
                  prediction.normal_probability
                )
              : 0,

          malicious_probability:
            prediction
              ? Number(
                  prediction.malicious_probability
                )
              : 0
        });

      });

    });


    // =========================================
    // ACTUAL MALICIOUS PULSE
    // =========================================

    nodes
      .filter(
        d => Number(d.label) === 1
      )
      .append("circle")
      .attr("class", "pulse")
      .attr("r", 15)
      .attr("fill", "none")
      .attr("stroke", "#ff3b3b")
      .attr("stroke-width", 1)
      .attr("opacity", 0.4);


    function pulse() {

      nodes
        .filter(
          d => Number(d.label) === 1
        )
        .select(".pulse")

        .attr("r", 15)
        .attr("opacity", 0.6)

        .transition()
        .duration(1200)

        .attr("r", 28)
        .attr("opacity", 0)

        .on("end", pulse);

    }

    pulse();


    // =========================================
    // ATTENTION VISUALIZATION
    // =========================================

    if (selectedNode) {
        console.log("SELECTED NODE:", selectedNode.node_id);
console.log("ATTENTION DATA:", data.attention);
console.log("ATTENTION COUNT:", data.attention.length);

      const selectedId =
        Number(selectedNode.node_id);


      edgeLines
        .each(function(edge) {

          const line = d3.select(this);

          const source =
            Number(edge.source);

          const target =
            Number(edge.target);


          const connected =
            source === selectedId ||
            target === selectedId;


          if (!connected) {

            line
              .attr("stroke", "#53657d")
              .attr("stroke-width", 1)
              .attr("opacity", 0.12);

            return;

          }


          const key =
            `${source}-${target}`;

          const attention =
            attentionMap.get(key) ?? 0;


          // -----------------------------------
          // ATTENTION SCALE
          // -----------------------------------

          const thickness =
            2 + attention * 8;


          const opacity =
            0.35 + attention * 0.65;


          line
            .attr("stroke", "#6ea8ff")
            .attr(
              "stroke-width",
              thickness
            )
            .attr(
              "opacity",
              opacity
            );

        });


      // ---------------------------------------
      // SELECTED NODE HIGHLIGHT
      // ---------------------------------------

      nodes
        .filter(
          d =>
            Number(d.node_id) ===
            selectedId
        )
        .append("circle")
        .attr("class", "selected-ring")
        .attr("r", 18)
        .attr("fill", "none")
        .attr("stroke", "#70a5ff")
        .attr("stroke-width", 2)
        .attr("opacity", 0.9);

    }


    // =========================================
    // LEGEND
    // =========================================

    const legend = svg
      .append("g")
      .attr(
        "transform",
        "translate(20,610)"
      );


    // Normal

    legend
      .append("circle")
      .attr("r", 6)
      .attr("fill", "#27e07f");

    legend
      .append("text")
      .text("Normal")
      .attr("x", 12)
      .attr("y", 4)
      .attr("fill", "#8b9ab0")
      .attr("font-size", "12px");


    // Actual malicious

    legend
      .append("circle")
      .attr("cx", 85)
      .attr("r", 6)
      .attr("fill", "#ff3b3b");

    legend
      .append("text")
      .text("Actual Malicious")
      .attr("x", 97)
      .attr("y", 4)
      .attr("fill", "#8b9ab0")
      .attr("font-size", "12px");


    // GAT alert

    legend
      .append("circle")
      .attr("cx", 225)
      .attr("r", 6)
      .attr("fill", "#ffb020");

    legend
      .append("text")
      .text("GAT Alert")
      .attr("x", 237)
      .attr("y", 4)
      .attr("fill", "#8b9ab0")
      .attr("font-size", "12px");


    // Attention indicator

    if (selectedNode) {

      legend
        .append("line")
        .attr("x1", 315)
        .attr("y1", 0)
        .attr("x2", 345)
        .attr("y2", 0)
        .attr("stroke", "#6ea8ff")
        .attr("stroke-width", 5);

      legend
        .append("text")
        .text("GAT Attention")
        .attr("x", 355)
        .attr("y", 4)
        .attr("fill", "#8b9ab0")
        .attr("font-size", "12px");

    }


    // =========================================
    // CLEANUP
    // =========================================

    return () => {

      svg
        .selectAll("*")
        .interrupt();

    };

  }, [
    data,
    selectedNode,
    setSelectedNode
  ]);


  return (
    <div className="network-container">

      <svg ref={svgRef} />

    </div>
  );
}

export default NetworkGraph;

