import axios from "axios";

const HUB_BASE_URL = "https://hub.pixeltronic.dev";
const HUMIDIFIER_BASE_URL = "https://humidifier.pixeltronic.dev";
const EXHAUST_BASE_URL = "https://exhaust.pixeltronic.dev";

const DEV_BASE_URL = "https://vpd.pixeltronic.dev";

axios.defaults.withCredentials = true;

export interface SensorData {
  temperature: number;  // Air temperature in °C
  humidity: number;     // Relative humidity in %
  vpd_air: number;      // Air VPD in kPa
  vpd_leaf: number;     // Leaf VPD in kPa
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

export const getVpdTarget = async (): Promise<{ min: number; max: number }> => {
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

export const toggleDevice = async (device: string, state: boolean) => {
  try {
    //const selectedDeviceApiUrl = getDeviceApiUrl(device);
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

export const getPredictedStates = async (sensorData: SensorData) => {
  try {
    const response = await axios.post(`${DEV_BASE_URL}/predict`, sensorData);
    return response.data;
  } catch (error) {
    console.error("Prediction API error:", error);
    return null;
  }
};
