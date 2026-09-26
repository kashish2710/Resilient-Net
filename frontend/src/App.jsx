
import { useEffect, useState } from "react";
import NetworkGraph from "./components/NetworkGraph";
import NodeDetails from "./components/NodeDetails";
import Statistics from "./components/Statistics";
import "./App.css";

function App() {
  const [snapshot, setSnapshot] = useState(0);
  const [data, setData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const [playing, setPlaying] = useState(true);
const [speed, setSpeed] = useState(1);

  // -----------------------------------------
  // LOAD SNAPSHOT
  // -----------------------------------------

  useEffect(() => {
    fetch(`https://resilient-net-1.onrender.com/api/snapshot/${snapshot}`)
      .then(response => response.json())
      .then(result => {
        setData(result);
if (!selectedNode && result.nodes.length > 0) {
    const randomNode =
        result.nodes[Math.floor(Math.random() * result.nodes.length)];

    const prediction = result.predictions.find(
        p => Number(p.node_id) === Number(randomNode.node_id)
    );

    setSelectedNode({
        ...randomNode,
        prediction: prediction
            ? Number(prediction.prediction)
            : 0,
        normal_probability: prediction
            ? Number(prediction.normal_probability)
            : 0,
        malicious_probability: prediction
            ? Number(prediction.malicious_probability)
            : 0
    });
}
        // Keep selected node synchronized
        if (selectedNode) {
          const updatedNode = result.nodes.find(
            node =>
              Number(node.node_id) ===
              Number(selectedNode.node_id)
          );

          if (updatedNode) {
            const prediction = result.predictions.find(
              p =>
                Number(p.node_id) ===
                Number(selectedNode.node_id)
            );

            setSelectedNode({
              ...updatedNode,
              prediction: prediction
                ? Number(prediction.prediction)
                : 0,
              normal_probability: prediction
                ? Number(prediction.normal_probability)
                : 0,
              malicious_probability: prediction
                ? Number(prediction.malicious_probability)
                : 0
            });
          }
        }
      })
      .catch(error =>
        console.error("API ERROR:", error)
      );
  }, [snapshot]);

  // -----------------------------------------
  // PLAYBACK
  // -----------------------------------------

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setSnapshot(current => {
        if (current >= 999) {
          return 0;
        }

        return current + 1;
      });
    }, 1000 / speed);

    return () => clearInterval(timer);
  }, [playing, speed]);

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (!data) {
    return (
      <div className="loading-screen">
        <div className="loading-box">
          <div className="loading-logo">
            RESINET
          </div>

          <div className="loading-line"></div>

          <p>
            INITIALIZING NETWORK INTELLIGENCE...
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // COUNTS
  // -----------------------------------------

  const actualMalicious = data.nodes.filter(
    node => Number(node.label) === 1
  ).length;

  const predictedMalicious =
    data.predictions.filter(
      node => Number(node.prediction) === 1
    ).length;

  return (
    <div className="app">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header className="topbar">

        <div className="brand-section">

          <div className="brand-icon">
            RN
          </div>

          <div>
            <h1>RESINET</h1>

            <p>
              DYNAMIC WIRELESS NETWORK
              INTRUSION DETECTION
            </p>
          </div>

        </div>


        <div className="system-status">

          <span className="online-dot"></span>

          <div>
            <strong>SYSTEM ONLINE</strong>
            <small>GAT ENGINE ACTIVE</small>
          </div>

        </div>


        <div className="snapshot-display">

          <span>SNAPSHOT</span>

          <strong>
            {String(snapshot).padStart(3, "0")}
          </strong>

          <small>/ 999</small>

        </div>

      </header>


      {/* ================================= */}
      {/* CONTROL BAR */}
      {/* ================================= */}

      <div className="control-bar">

        <div className="control-left">

          <button
            className={
              playing
                ? "control-button active"
                : "control-button"
            }
            onClick={() =>
              setPlaying(current => !current)
            }
          >
            {playing ? "❚❚  PAUSE" : "▶  PLAY"}
          </button>


          <button
            className="icon-button"
            onClick={() =>
              setSnapshot(current =>
                Math.max(0, current - 1)
              )
            }
          >
            ◀
          </button>


          <button
            className="icon-button"
            onClick={() =>
              setSnapshot(current =>
                Math.min(999, current + 1)
              )
            }
          >
            ▶
          </button>


          <div className="timeline">

            <input
              type="range"
              min="0"
              max="999"
              value={snapshot}
              onChange={e =>
                setSnapshot(
                  Number(e.target.value)
                )
              }
            />

          </div>

        </div>


        <div className="speed-control">

          <span>SPEED</span>

          {[0.5, 1, 2, 5].map(value => (

            <button
              key={value}
              className={
                speed === value
                  ? "speed-button selected"
                  : "speed-button"
              }
              onClick={() =>
                setSpeed(value)
              }
            >
              {value}x
            </button>

          ))}

        </div>

      </div>


      {/* ================================= */}
      {/* MAIN DASHBOARD */}
      {/* ================================= */}

      <main className="dashboard">

        {/* LEFT — TOPOLOGY */}

        <section className="topology-panel">

          <div className="panel-header">

            <div>

              <h2>NETWORK TOPOLOGY</h2>

              <span>
                REAL-TIME GRAPH STATE
              </span>

            </div>

            <div className="topology-status">
              ● LIVE
            </div>

          </div>


          <NetworkGraph
            data={data}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />

        </section>


       {/* RIGHT — NODE INTELLIGENCE */}
<aside className="intelligence-panel">

  <div className="node-instruction">
    <strong>SELECT ANY NODE</strong>
    <span>
      Click on a node in the network graph to view its details.
    </span>
  </div>

  <NodeDetails
    node={selectedNode}
  />

</aside>

      </main>


      {/* ================================= */}
      {/* BOTTOM METRICS */}
      {/* ================================= */}

      <section className="bottom-metrics">

        <div className="metric">

          <span>NETWORK NODES</span>

          <strong>
            {data.nodes.length}
          </strong>

          <small>ACTIVE</small>

        </div>


        <div className="metric">

          <span>ACTIVE LINKS</span>

          <strong>
            {data.edges.length}
          </strong>

          <small>CONNECTED</small>

        </div>


        <div className="metric danger">

          <span>ACTUAL ATTACKS</span>

          <strong>
            {actualMalicious}
          </strong>

          <small>GROUND TRUTH</small>

        </div>


        <div className="metric warning">

          <span>GAT ALERTS</span>

          <strong>
            {predictedMalicious}
          </strong>

          <small>MODEL PREDICTIONS</small>

        </div>


        <div className="metric">

          <span>GAT MODEL</span>

          <strong>
            87.6%
          </strong>

          <small>ROC-AUC</small>

        </div>

      </section>


      {/* ================================= */}
      {/* FOOTER */}
      {/* ================================= */}

      <footer>

        <span>
          RESINET // GRAPH ATTENTION NETWORK
        </span>

        <span>
          DYNAMIC AD-HOC NETWORK MONITOR
        </span>

      </footer>

    </div>
  );
}

export default App;

