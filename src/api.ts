import axios from "axios";

const HUB_BASE_URL = "https://hub.pixeltronic.dev";
const HUMIDIFIER_BASE_URL = "https://humidifier.pixeltronic.dev";
const EXHAUST_BASE_URL = "https://exhaust.pixeltronic.dev";

const DEV_BASE_URL = "https://vpd.pixeltronic.dev";

axios.defaults.withCredentials = true;

export default {
  getDeviceApiUrl(device: string) {
    if (device === "hub") {
      return HUB_BASE_URL;
    } else if (device === "exhaust") {
      return EXHAUST_BASE_URL;
    } else {
      return HUMIDIFIER_BASE_URL;
    }
  },

  async toggleDevice(device: string, state: boolean) {
    try {
      const selectedDeviceApiUrl = this.getDeviceApiUrl(device);
      const response = await axios.post(`${DEV_BASE_URL}/${device}/${state}`);
      return response.data;
    } catch (error) {
      console.error("Error toggling device:", error);
      return { error: "Failed to toggle device" };
    }
  },

  async getSensorData() {
    try {
      const response = await axios.get(`${DEV_BASE_URL}/sensor_data`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      return { error: "Failed to retrieve sensor data" };
    }
  },

  async getDeviceStatus() {
    try {
      const response = await axios.get(`${DEV_BASE_URL}/device_status`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching device status:", error);
      return { error: "Failed to retrieve device status" };
    }
  },

  async getDeviceInfo() {
    try {
      const response = await axios.get(`${DEV_BASE_URL}/device_info_json`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching info data:", error);
      return { error: "Failed to retrieve info data" };
    }
  },
};
