<template>
  <n-card title="📡 Device Control & Status" class="device-panel">
    <n-space vertical>
      <!-- ✅ Device Status Table with Power Toggle -->
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="deviceData"
        :pagination="pagination"
      />
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import {
  getExhaustInfo,
  getHumidifierInfo,
  getDehumidifierInfo,
  toggleDevice,
} from "../api";
import { ref, h, onMounted } from "vue";
import { NTag, NSwitch, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";

const message = useMessage();

const deviceData = ref<Array<Record<string, any>>>([]);
const pagination = ref({ pageSize: 10 });

const toggleDevicePower = async (device: string, currentState: boolean) => {
  const newState = currentState ? "on" : "off"; 
  try {
    const response = await toggleDevice(device, newState);
    if (response) {
      message.success(`${device.charAt(0).toUpperCase() + device.slice(1)} turned ${newState.toUpperCase()}`);

      // Update UI immediately after toggling
      const deviceIndex = deviceData.value.findIndex((d) => d.device_name === device);
      if (deviceIndex !== -1) {
        deviceData.value[deviceIndex].device_on = newState === "on";
      }
    }
  } catch (error) {
    message.error(`Failed to toggle ${device}`);
    console.error(error);
  }
};

const fetchDeviceInfo = async () => {
  try {
    const exhaustData = await getExhaustInfo();
    const humidifierData = await getHumidifierInfo();
    const dehumidifierData = await getDehumidifierInfo();

    exhaustData.device_name = "exhaust";
    humidifierData.device_name = "humidifier";
    dehumidifierData.device_name = "dehumidifier";

    exhaustData.nickname = decodeBase64(exhaustData.nickname) || "Exhaust";
    humidifierData.nickname = decodeBase64(humidifierData.nickname) || "Humidifier";
    dehumidifierData.nickname = decodeBase64(dehumidifierData.nickname) || "Dehumidifier";

    deviceData.value = [exhaustData, humidifierData, dehumidifierData];
    console.table(deviceData.value);
  } catch (error) {
    console.error("🚨 Error fetching device info:", error);
  }
};

/** 🧩 Decode Base64 Names */
const decodeBase64 = (str: string | null) => {
  try {
    return str ? atob(str) : "Unknown";
  } catch {
    return "Unknown";
  }
};

const classifyStatus = (status: boolean): { type: "success" | "error"; label: string } => ({
  type: status ? "success" : "error",
  label: status ? "ON" : "OFF",
});

const classifySignalStrength = (rssi: number): { type: "error" | "warning" | "success"; label: string } => {
  if (rssi <= -80) return { type: "error", label: "Weak" };
  if (rssi > -80 && rssi <= -60) return { type: "warning", label: "Moderate" };
  return { type: "success", label: "Strong" };
};

const columns: DataTableColumns<any> = [
  { title: "📌 Nickname", key: "nickname" },
  { title: "📡 IP Address", key: "ip" },
  {
    title: "📶 Signal Strength",
    key: "rssi",
    render(row) {
      const signal = classifySignalStrength(row.rssi);
      return h(NTag, { type: signal.type, bordered: false }, { default: () => `${signal.label} (${row.rssi} dBm)` });
    },
  },
  {
    title: "⚡ Power Status",
    key: "device_on",
    render(row) {
      return h(NSwitch, {
        value: row.device_on,
        "on-update:value": (newValue: boolean) => {
          console.log(newValue)
          toggleDevicePower(row.device_name, newValue);
        }  
      });
    },
  },
  {
    title: "🔥 Overheat",
    key: "overheated",
    render(row) {
      return h(NTag, { type: row.overheated ? "error" : "success", bordered: false }, { default: () => (row.overheated ? "Overheated" : "Normal") });
    },
  },
  {
    title: "⏳ On Time (s)",
    key: "on_time",
    render(row) {
      return row.on_time ? `${row.on_time} sec` : "N/A";
    },
  },
];

const updateData = async () => {
  await fetchDeviceInfo();
};


onMounted(async () => {
  await updateData();
  console.log(deviceData.value);
});
</script>

<style scoped>
.device-panel {
  max-width: 100%;
  margin: auto;
  text-align: center;
}
</style>
