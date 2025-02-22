<template>
  <n-card title="🔌 Device Status" class="device-status">
    <n-space vertical>
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="deviceData"
        :pagination="pagination"
      />
    </n-space>
  </n-card>
  <n-card title="🔧 Device Control Panel" class="control-panel">
    <n-space vertical :size="12">
      <!-- Humidifier Controls -->
      <n-button-group>
        <n-button @click="toggleTapoDevice('humidifier', 'on')" type="primary">
          💦 Turn Humidifier ON
        </n-button>
        <n-button @click="toggleTapoDevice('humidifier', 'off')" type="warning">
          ❌ Turn Humidifier OFF
        </n-button>
      </n-button-group>

      <!-- Exhaust Controls -->
      <n-button-group>
        <n-button @click="toggleTapoDevice('exhaust', 'on')" type="primary">
          🌬️ Turn Exhaust ON
        </n-button>
        <n-button @click="toggleTapoDevice('exhaust', 'off')" type="warning">
          ❌ Turn Exhaust OFF
        </n-button>
      </n-button-group>

      <!-- Dehumidifier Controls -->
      <n-button-group>
        <n-button
          @click="toggleTapoDevice('dehumidifier', 'on')"
          type="primary"
        >
          🏜️ Turn Dehumidifier ON
        </n-button>
        <n-button
          @click="toggleTapoDevice('dehumidifier', 'off')"
          type="warning"
        >
          ❌ Turn Dehumidifier OFF
        </n-button>
      </n-button-group>

      <!-- Device Status Display -->
      <n-divider />
      <n-alert type="info" title="Device Status" show-icon>
        <pre>{{ deviceStatus }}</pre>
      </n-alert>
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
import { NTag, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";

const message = useMessage();

const deviceData = ref<Array<Record<string, any>>>([]);
const pagination = ref({
  pageSize: 10,
});

const deviceStatus = ref<Record<string, boolean>>({
  humidifier: false,
  exhaust: false,
  dehumidifier: false,
});

// Function to toggle devices
const toggleTapoDevice = async (device: string, state: "on" | "off") => {
  try {
    const response = await toggleDevice(device, state === "on");
    deviceStatus.value[device] = state === "on";
    message.success(
      `${
        device.charAt(0).toUpperCase() + device.slice(1)
      } turned ${state.toUpperCase()}`
    );
  } catch (error) {
    message.error(`Failed to toggle ${device}`);
    console.error(error);
  }
};

/** 🔄 Fetch Device Data */
const fetchDeviceInfo = async () => {
  try {
    const exhaustData = await getExhaustInfo();
    const humidifierData = await getHumidifierInfo();
    const dehumidifierData = await getDehumidifierInfo();

    // Decode Base64 names
    exhaustData.nickname = decodeBase64(exhaustData.nickname) || "Exhaust";
    humidifierData.nickname =
      decodeBase64(humidifierData.nickname) || "Humidifier";
    dehumidifierData.nickname =
      decodeBase64(dehumidifierData.nickname) || "Dehumidifier";

    // Map devices into table
    deviceData.value = [exhaustData, humidifierData, dehumidifierData];
  } catch (error) {
    console.error("🚨 Error fetching device info:", error);
  }
};

/** 🧩 Decode Base64 Nicknames */
const decodeBase64 = (str: string | null) => {
  try {
    return str ? atob(str) : "Unknown";
  } catch {
    return "Unknown";
  }
};

/** 🏷️ Function to classify device status */
const classifyStatus = (
  status: boolean
): { type: "success" | "error"; label: string } => {
  return {
    type: status ? "success" : "error",
    label: status ? "ON" : "OFF",
  };
};

/** 📶 Classify Signal Strength */
const classifySignalStrength = (
  rssi: number
): { type: "error" | "warning" | "success"; label: string } => {
  if (rssi <= -80) return { type: "error", label: "Weak" }; // ❌ Poor signal
  if (rssi > -80 && rssi <= -60) return { type: "warning", label: "Moderate" }; // ⚠️ Moderate signal
  return { type: "success", label: "Strong" }; // ✅ Strong signal
};

/** 📝 Define Table Columns */
const columns: DataTableColumns<any> = [
  { title: "📌 Nickname", key: "nickname" },
  { title: "📡 IP Address", key: "ip" },
  {
    title: "📶 Signal Strength",
    key: "rssi",
    render(row) {
      const signal = classifySignalStrength(row.rssi);
      return h(
        NTag,
        { type: signal.type, bordered: false },
        { default: () => `${signal.label} (${row.rssi} dBm)` }
      );
    },
  },

  {
    title: "⚡ Power Status",
    key: "device_on",
    render(row) {
      const status = classifyStatus(row.device_on);
      return h(
        NTag,
        { type: status.type as "success" | "error", bordered: false },
        { default: () => status.label }
      );
    },
  },
  {
    title: "🔥 Overheat",
    key: "overheated",
    render(row) {
      return h(
        NTag,
        { type: row.overheated ? "error" : "success", bordered: false },
        { default: () => (row.overheated ? "Overheated" : "Normal") }
      );
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
.control-panel,
.device-status {
  max-width: 100%;
  margin: auto;
  text-align: center;
}

.control-panel {
  margin-top: 16px;
}
</style>
