function ControlPanel({
  snapshot,
  setSnapshot,
  playing,
  setPlaying,
  speed,
  setSpeed
}) {

  return (
    <div className="controls">

      <button
        onClick={() => {
          console.log("Play clicked");
          setPlaying(prev => !prev);
        }}
      >
        {playing ? "⏸ PAUSE" : "▶ PLAY"}
      </button>


      <button
        onClick={() => {
          setSnapshot(prev => Math.max(0, prev - 1));
        }}
      >
        ◀
      </button>


      <button
        onClick={() => {
          setSnapshot(prev => Math.min(999, prev + 1));
        }}
      >
        ▶
      </button>


      <input
        type="range"
        min="0"
        max="999"
        value={snapshot}
        onChange={(e) => {
          setSnapshot(Number(e.target.value));
        }}
      />


      <span className="speed-label">
        SPEED
      </span>


      <select
        value={speed}
        onChange={(e) => {
          setSpeed(Number(e.target.value));
        }}
      >
        <option value={0.5}>0.5×</option>
        <option value={1}>1×</option>
        <option value={2}>2×</option>
        <option value={5}>5×</option>
        <option value={10}>10×</option>
      </select>

    </div>
  );
}

export default ControlPanel;