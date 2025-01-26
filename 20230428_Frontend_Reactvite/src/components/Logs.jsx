// src/components/Logs.jsx
import PropTypes from "prop-types";

const Logs = ({ logs }) => {
  return (
    <div className="logs-card">
      <h2>System Logs</h2>
      <div className="logs-container">
        {logs.map((log, index) => (
          <div key={index} className="log-entry">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

Logs.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Logs;
