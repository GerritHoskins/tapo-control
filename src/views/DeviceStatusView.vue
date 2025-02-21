<template>
  <n-card title="🔌 Device Status" class="device-status">
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="deviceData"
      :pagination="pagination"
    />
  </n-card>
</template>

<script setup lang="ts">
import { getDeviceStatus, getExhaustInfo, getHumidifierInfo, getDehumidifierInfo } from "../api";
import { ref, h, onMounted } from "vue";
import { NTag } from "naive-ui";
import type { DataTableColumns } from "naive-ui";

const deviceStatusData = ref({});
const exhaustInfoData = ref({});
const humidifierInfoData = ref({});

// Sample Device Data (Replace with API data)
const deviceData = ref([]);
const pagination = ref({
  pageSize: 10,
});

// **Function to classify signal strength**
const classifySignal = (rssi: number) => {
  if (rssi >= -50) return { text: "📶 Excellent", type: "success" };
  if (rssi >= -70) return { text: "📡 Good", type: "warning" };
  return { text: "🚨 Weak", type: "error" };
};

// **Define Table Columns**
const columns: DataTableColumns<any> = [
  { title: "📛 Name", key: "nickname" },
  { title: "🆔 Model", key: "model" },
  { title: "🌐 IP Address", key: "ip" },
  {
    title: "⚡ Status",
    key: "device_on",
    render(row) {
      return h(
        NTag,
        { type: row.device_on ? "success" : "error", bordered: false },
        { default: () => (row.device_on ? "🟢 ON" : "🔴 OFF") }
      );
    },
  },
  {
    title: "📶 Signal Strength",
    key: "rssi",
    render(row) {
      const { text, type } = classifySignal(row.rssi);
      return h(NTag, { type, bordered: false }, { default: () => text });
    },
  },
];

const fetchDeviceInfo = async () => {
  const exhaustData = await getExhaustInfo();
  const humidifierData = await getHumidifierInfo();
  const dehumidifierData = await getDehumidifierInfo();
  const deviceStatusData = await getDeviceStatus();

  // Ensure the nickname property is properly set
  exhaustData.nickname = "Exhaust";
  humidifierData.nickname = "Humidifier";
  dehumidifierData.nickname = "Dehumidifier";

  deviceStatusData.device_on = true;

  // Reset the device list and update with fresh data
  deviceData.value = [exhaustData, humidifierData, dehumidifierData, deviceStatusData];
};

const updateData = async () => {
  await fetchDeviceInfo();
};

onMounted(async () => 
{
  await updateData()
  console.log(deviceData.value)
}
);
</script>
