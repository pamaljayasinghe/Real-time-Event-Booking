import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:8080/api/system";

export const useTicketSystem = () => {
  const [systemStatus, setSystemStatus] = useState({
    running: false,
    currentTickets: 0,
    maxTickets: 150,
    vendors: 0,
    customers: 0,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWithOptions = async (url, options = {}) => {
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });

      // Always try to parse JSON response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  const startSystem = async (config) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Starting system with config:", config);
      const response = await fetchWithOptions(`${API_BASE_URL}/start`, {
        method: "POST",
        body: JSON.stringify(config),
      });
      console.log("System started successfully:", response);
      await fetchStatus(); // Refresh status after starting
    } catch (error) {
      console.error("Error starting system:", error);
      setError(`Failed to start system: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const stopSystem = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Stopping system");
      const response = await fetchWithOptions(`${API_BASE_URL}/stop`, {
        method: "POST",
      });
      console.log("System stopped successfully:", response);
      await fetchStatus(); // Refresh status after stopping
    } catch (error) {
      console.error("Error stopping system:", error);
      setError(`Failed to stop system: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addVendor = async () => {
    setError(null);
    try {
      console.log("Adding vendor");
      const response = await fetchWithOptions(`${API_BASE_URL}/vendor/add`, {
        method: "POST",
      });
      console.log("Vendor added successfully:", response);
      if (response.success) {
        setSystemStatus((prev) => ({
          ...prev,
          vendors: response.vendorCount,
        }));
      }
    } catch (error) {
      console.error("Error adding vendor:", error);
      setError(`Failed to add vendor: ${error.message}`);
      throw error;
    }
  };

  const removeVendor = async () => {
    setError(null);
    try {
      console.log("Removing vendor");
      const response = await fetchWithOptions(`${API_BASE_URL}/vendor/remove`, {
        method: "POST",
      });
      console.log("Vendor removed successfully:", response);
      if (response.success) {
        setSystemStatus((prev) => ({
          ...prev,
          vendors: response.vendorCount,
        }));
      }
    } catch (error) {
      console.error("Error removing vendor:", error);
      setError(`Failed to remove vendor: ${error.message}`);
      throw error;
    }
  };

  const addCustomer = async () => {
    setError(null);
    try {
      console.log("Adding customer");
      const response = await fetchWithOptions(`${API_BASE_URL}/customer/add`, {
        method: "POST",
      });
      console.log("Customer added successfully:", response);
      if (response.success) {
        setSystemStatus((prev) => ({
          ...prev,
          customers: response.customerCount,
        }));
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      setError(`Failed to add customer: ${error.message}`);
      throw error;
    }
  };

  const removeCustomer = async () => {
    setError(null);
    try {
      console.log("Removing customer");
      const response = await fetchWithOptions(
        `${API_BASE_URL}/customer/remove`,
        {
          method: "POST",
        }
      );
      console.log("Customer removed successfully:", response);
      if (response.success) {
        setSystemStatus((prev) => ({
          ...prev,
          customers: response.customerCount,
        }));
      }
    } catch (error) {
      console.error("Error removing customer:", error);
      setError(`Failed to remove customer: ${error.message}`);
      throw error;
    }
  };

  const fetchStatus = async () => {
    try {
      const data = await fetchWithOptions(`${API_BASE_URL}/status`);
      setSystemStatus(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching status:", error);
      setError(`Failed to fetch status: ${error.message}`);
    }
  };

  useEffect(() => {
    let intervalId;

    if (systemStatus.running) {
      intervalId = setInterval(fetchStatus, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [systemStatus.running]);

  // Initial status fetch
  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    systemStatus,
    error,
    loading,
    startSystem,
    stopSystem,
    addVendor,
    removeVendor,
    addCustomer,
    removeCustomer,
  };
};
