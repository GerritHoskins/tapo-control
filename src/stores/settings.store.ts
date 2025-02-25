import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { ConfigSettingsResponse } from "../types/settings.interface";

const DEV_BASE_URL = "https://vpd.pixeltronic.dev";

export const useSettingsStore = defineStore("settings", () => {
  const config = ref<ConfigSettingsResponse | null>(null);

  const fetchConfigSettings = async () => {
    try {
      const response = await axios.get<ConfigSettingsResponse>(`${DEV_BASE_URL}/config-settings`, {
        withCredentials: true,
      });
  
      config.value = response.data; 
    } catch (error) {
        console.error("❌ Error fetching config settings:", error);
    }
  };

  return {
    fetchConfigSettings,
    config,
  };
});
