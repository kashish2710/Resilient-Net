
function Statistics({ data }) {

  const actualMalicious = data.nodes.filter(
    node => Number(node.label) === 1
  ).length;

  const predictedMalicious = data.predictions.filter(
    node => Number(node.prediction) === 1
  ).length;

  const truePositive = data.nodes.filter(node => {
    const prediction = data.predictions.find(
      p => Number(p.node_id) === Number(node.node_id)
    );

    return (
      Number(node.label) === 1 &&
      prediction &&
      Number(prediction.prediction) === 1
    );
  }).length;

  const falsePositive = data.nodes.filter(node => {
    const prediction = data.predictions.find(
      p => Number(p.node_id) === Number(node.node_id)
    );

    return (
      Number(node.label) === 0 &&
      prediction &&
      Number(prediction.prediction) === 1
    );
  }).length;

  const avgTrust =
    data.nodes.reduce(
      (sum, node) =>
        sum + Number(node.trust_score),
      0
    ) / data.nodes.length;

  return (
    <div className="panel">

      <h2>NETWORK ANALYTICS</h2>

      <div className="stats-grid">

        <div className="stat-card">
          <span>NODES</span>
          <strong>
            {data.nodes.length}
          </strong>
        </div>

        <div className="stat-card">
          <span>EDGES</span>
          <strong>
            {data.edges.length}
          </strong>
        </div>

        <div className="stat-card">
          <span>ACTUAL MALICIOUS</span>
          <strong className="red-text">
            {actualMalicious}
          </strong>
        </div>

        <div className="stat-card">
          <span>GAT PREDICTED</span>
          <strong style={{ color: "#ff9f1c" }}>
            {predictedMalicious}
          </strong>
        </div>

        <div className="stat-card">
          <span>TRUE POSITIVE</span>
          <strong>
            {truePositive}
          </strong>
        </div>

        <div className="stat-card">
          <span>FALSE POSITIVE</span>
          <strong style={{ color: "#ff9f1c" }}>
            {falsePositive}
          </strong>
        </div>

        <div className="stat-card">
          <span>AVG TRUST</span>
          <strong>
            {avgTrust.toFixed(3)}
          </strong>
        </div>

      </div>

    </div>
  );
}

export default Statistics;

