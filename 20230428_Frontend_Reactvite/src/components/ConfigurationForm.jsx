// src/components/ConfigurationForm.jsx
import PropTypes from "prop-types";
import { useState } from "react";

const ConfigurationForm = ({ onSubmit }) => {
  const [config, setConfig] = useState({
    totalTickets: 107,
    ticketReleaseRate: 4,
    customerRetrievalRate: 3,
    maxTicketCapacity: 150,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (config.totalTickets < 0) newErrors.totalTickets = "Must be positive.";
    if (config.ticketReleaseRate < 0)
      newErrors.ticketReleaseRate = "Must be positive.";
    if (config.customerRetrievalRate < 0)
      newErrors.customerRetrievalRate = "Must be positive.";
    if (config.maxTicketCapacity < config.totalTickets)
      newErrors.maxTicketCapacity = "Max capacity must be >= total tickets.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setConfig({
      ...config,
      [e.target.name]: parseInt(e.target.value, 10),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(config);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="config-form">
      <h2>System Configuration</h2>
      <div className="form-group">
        <label>Total Number of Tickets:</label>
        <input
          type="number"
          name="totalTickets"
          value={config.totalTickets}
          onChange={handleChange}
          required
        />
        {errors.totalTickets && (
          <span className="error">{errors.totalTickets}</span>
        )}
      </div>
      <div className="form-group">
        <label>Ticket Release Rate:</label>
        <input
          type="number"
          name="ticketReleaseRate"
          value={config.ticketReleaseRate}
          onChange={handleChange}
          required
        />
        {errors.ticketReleaseRate && (
          <span className="error">{errors.ticketReleaseRate}</span>
        )}
      </div>
      <div className="form-group">
        <label>Customer Retrieval Rate:</label>
        <input
          type="number"
          name="customerRetrievalRate"
          value={config.customerRetrievalRate}
          onChange={handleChange}
          required
        />
        {errors.customerRetrievalRate && (
          <span className="error">{errors.customerRetrievalRate}</span>
        )}
      </div>
      <div className="form-group">
        <label>Maximum Ticket Capacity:</label>
        <input
          type="number"
          name="maxTicketCapacity"
          value={config.maxTicketCapacity}
          onChange={handleChange}
          required
        />
        {errors.maxTicketCapacity && (
          <span className="error">{errors.maxTicketCapacity}</span>
        )}
      </div>
      <button type="submit" className="submit-button">
        Apply Configuration
      </button>
    </form>
  );
};

ConfigurationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ConfigurationForm;
