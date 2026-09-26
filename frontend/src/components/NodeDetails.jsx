function NodeDetails({ node }) {

  if (!node) {
    return (
      <div className="panel node-details">
        <h2>NODE DETAILS</h2>

        <div className="empty-node">
          Select a node from the network
        </div>
      </div>
    );
  }

  const malicious =
    Number(node.prediction) === 1;

  return (
    <div className="panel node-details">

      <div className="panel-title">
        <h2>NODE {node.node_id}</h2>

        <span
          className={
            malicious
              ? "status malicious-status"
              : "status normal-status"
          }
        >
          {malicious ? "MALICIOUS" : "NORMAL"}
        </span>
      </div>


      <div className="node-grid">

        <div>
          <span>Position</span>
          <strong>
            {Number(node.x).toFixed(1)},
            {" "}
            {Number(node.y).toFixed(1)}
          </strong>
        </div>

        <div>
          <span>Speed</span>
          <strong>
            {Number(node.speed).toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Degree</span>
          <strong>
            {node.degree}
          </strong>
        </div>

        <div>
          <span>Trust</span>
          <strong>
            {Number(node.trust_score).toFixed(3)}
          </strong>
        </div>

        <div>
          <span>Drop Ratio</span>
          <strong>
            {Number(node.drop_ratio).toFixed(3)}
          </strong>
        </div>

        <div>
          <span>Forward Ratio</span>
          <strong>
            {Number(node.forwarding_ratio).toFixed(3)}
          </strong>
        </div>

      </div>


      <div className="prediction-box">

        <h3>GAT PREDICTION</h3>

        <div className="probability">

          <div className="probability-label">
            <span>Normal</span>
            <strong>
              {(Number(node.normal_probability) * 100).toFixed(1)}%
            </strong>
          </div>

          <div className="bar">
            <div
              className="normal-bar"
              style={{
                width:
                  `${Number(node.normal_probability) * 100}%`
              }}
            />
          </div>

        </div>


        <div className="probability">

          <div className="probability-label">
            <span>Malicious</span>

            <strong>
              {(Number(node.malicious_probability) * 100).toFixed(1)}%
            </strong>
          </div>

          <div className="bar">

            <div
              className="malicious-bar"
              style={{
                width:
                  `${Number(node.malicious_probability) * 100}%`
              }}
            />

          </div>

        </div>

      </div>


      <div className="attack-info">

        <span>Attack Type</span>

        <strong>
          {node.attack_type || "None"}
        </strong>

      </div>

    </div>
  );
}

export default NodeDetails;