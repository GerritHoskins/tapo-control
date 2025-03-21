import axios from "axios";

const HUB_BASE_URL = "https://hub.pixeltronic.dev";
const HUMIDIFIER_BASE_URL = "https://humidifier.pixeltronic.dev";
const EXHAUST_BASE_URL = "https://exhaust.pixeltronic.dev";

const DEV_BASE_URL = "https://vpd.pixeltronic.dev";

axios.defaults.withCredentials = true;

export interface SensorData {
  temperature: number; // Air temperature in °C
  humidity: number; // Relative humidity in %
  leaf_temperature: number;
  vpd_air: number; // Air VPD in kPa
  vpd_leaf: number; // Leaf VPD in kPa
  exhaust?: number;
  humidifier?: number;
  dehumidifier?: number;
}

export interface PredictedDeviceState {
  exhaust: boolean; 
  humidifier: boolean; 
  dehumidifier: boolean;
}

export const setVpdTarget = async (stage: string): Promise<void> => {
  await axios.post(
    `${DEV_BASE_URL}/set_vpd_target`,
    { stage },
    {
      withCredentials: true,
    }
  );
};

//export const getVpdTarget = async (): Promise<{ min: number; max: number }> => {
export const getVpdTarget = async (): Promise<{ stage: string }> => {
  const response = await axios.get(`${DEV_BASE_URL}/get_vpd_target`, {
    withCredentials: true,
  });
  return response.data;
};

export const getDeviceApiUrl = (device: string) => {
  if (device === "hub") {
    return HUB_BASE_URL;
  } else if (device === "exhaust") {
    return EXHAUST_BASE_URL;
  } else {
    return HUMIDIFIER_BASE_URL;
  }
};

export const toggleDevice = async (device: string, state: "on" | "off") => {
  try {
    //const selectedDeviceApiUrl = getDeviceApiUrl(device);
    console.log(state);
    const response = await axios.post(`${DEV_BASE_URL}/${device}/${state}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling device:", error);
    return { error: "Failed to toggle device" };
  }
};

export const getSensorData = async () => {
  try {
    const response = await axios.get(`${DEV_BASE_URL}/sensor_data`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return { error: "Failed to retrieve sensor data" };
  }
};

export const getDeviceStatus = async () => {
  try {
    const response = await axios.get(`${DEV_BASE_URL}/device_status`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching device status:", error);
    return { error: "Failed to retrieve device status" };
  }
};

export const getExhaustInfo = async () => {
  try {
    const response = await axios.get(`${DEV_BASE_URL}/exhaust_info_json`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching device status:", error);
    return { error: "Failed to retrieve device status" };
  }
};

export const getHumidifierInfo = async () => {
  try {
    const response = await axios.get(`${DEV_BASE_URL}/humidifier_info_json`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching device status:", error);
    return { error: "Failed to retrieve device status" };
  }
};

export const getDehumidifierInfo = async () => {
  try {
    const response = await axios.get(`${DEV_BASE_URL}/dehumidifier_info_json`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching device status:", error);
    return { error: "Failed to retrieve device status" };
  }
};

export const getDeviceInfo = async () => {
  try {
    const response = await axios.get(`${DEV_BASE_URL}/device_info_json`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching info data:", error);
    return { error: "Failed to retrieve info data" };
  }
};

export const getPredictionData = async () => {
  try {
    const response = await axios.get(`${DEV_BASE_URL}/get_prediction_data`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Prediction API error:", error);
    return null;
  }
};

export const detectAnomaly = async (sensorData: any) => {
  console.log("🔍 Sending data for anomaly detection:", sensorData);

  const formattedData = {
    temperature: sensorData.temperature ?? 0,
    leaf_temperature: sensorData.leaf_temperature ?? 0,
    humidity: sensorData.humidity ?? 0,
    vpd_air: sensorData.vpd_air ?? 0,
    vpd_leaf: sensorData.vpd_leaf ?? 0,
    exhaust: sensorData.exhaust ?? 0,
    humidifier: sensorData.humidifier ?? 0,
    dehumidifier: sensorData.dehumidifier ?? 0,
  };

  try {
    const response = await axios.post(
      `${DEV_BASE_URL}/detect_anomaly`,
      formattedData,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("⚠️ Anomaly Detection API error:", error);
    return null;
  }
};

export const getOptimizedControl = async (
  sensorData: SensorData
): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${DEV_BASE_URL}/adjust_conditions`,
      sensorData,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.best_action;
  } catch (error) {
    console.error("⚠️ RL Control API error:", error);
    return null;
  }
};

export const getPredictedAction = async (sensorData: SensorData) => {
  try {
    if (typeof sensorData !== "object") {
      throw new Error("Invalid sensorData format. Expected an object.");
    }

    const response = await axios.post(
      `${DEV_BASE_URL}/predict_action`,
      JSON.stringify(sensorData), // Ensure proper JSON format
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid API response format.");
    }

    return response.data.predicted_action || "unknown_action";
  } catch (error: any) {
    console.error("🚨 RL Prediction API Error:", error.response?.data || error.message);
    return null;
  }
};

export const getPredictedStates = async (sensorData: SensorData): Promise<PredictedDeviceState | null> => {
  try {
    if (typeof sensorData !== "object" || sensorData === null) {
      throw new Error("Invalid sensorData format. Expected a valid JSON object.");
    }

    console.log("📤 Sending request with data:", sensorData); // Debugging

    const response = await axios.post(
      `${DEV_BASE_URL}/predict`,
      JSON.stringify(sensorData), // Ensure correct JSON format
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("✅ API Response:", response.data); // Debugging

    if (response.data && typeof response.data === "object") {
      return {
        exhaust: response.data.exhaust ?? false, // Ensure boolean values
        humidifier: response.data.humidifier ?? false,
        dehumidifier: response.data.dehumidifier ?? false,
      };
    }

    throw new Error("Invalid API response format.");

  } catch (error: any) {
    console.error("🚨 Prediction API error:", error.response?.data || error.message);
    return null;
  }
};
