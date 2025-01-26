// src/components/ControlPanel.jsx
import PropTypes from "prop-types";

const ControlPanel = ({
  systemRunning,
  toggleSystem,
  vendors,
  customers,
  onVendorChange,
  onCustomerChange,
  onConfigSubmit,
}) => {
  return (
    <div className="control-panel">
      <h2>Control Panel</h2>
      <div className="controls">
        <button
          onClick={toggleSystem}
          className={`control-button ${systemRunning ? "stop" : "start"}`}
        >
          {systemRunning ? "Stop System" : "Start System"}
        </button>
      </div>
      <div className="entity-controls">
        <div className="entity-control">
          <label>Vendors:</label>
          <button onClick={() => onVendorChange("-")}>-</button>
          <span>{vendors}</span>
          <button onClick={() => onVendorChange("+")}>+</button>
        </div>
        <div className="entity-control">
          <label>Customers:</label>
          <button onClick={() => onCustomerChange("-")}>-</button>
          <span>{customers}</span>
          <button onClick={() => onCustomerChange("+")}>+</button>
        </div>
      </div>
      <button onClick={onConfigSubmit} className="submit-button">
        Submit Changes
      </button>
    </div>
  );
};

ControlPanel.propTypes = {
  systemRunning: PropTypes.bool.isRequired,
  toggleSystem: PropTypes.func.isRequired,
  vendors: PropTypes.number.isRequired,
  customers: PropTypes.number.isRequired,
  onVendorChange: PropTypes.func.isRequired,
  onCustomerChange: PropTypes.func.isRequired,
  onConfigSubmit: PropTypes.func.isRequired,
};

export default ControlPanel;
