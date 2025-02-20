<template>
  <n-config-provider>
    <n-space vertical :size="12">
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="vpdData"
        :pagination="pagination"
      />
    </n-space>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, h, onMounted, onUnmounted } from "vue";
import { NTag, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";

// WebSocket URL
let socket: WebSocket | null = null;
const WS_URL = "ws://localhost:8000/ws/vpd";
const vpdData = ref<
  { timestamp: string; temperature: number; humidity: number; vpd_air: number; vpd_leaf: number }[]
>([]);

const pagination = ref({
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20],
  showQuickJumper: true,
});

const message = useMessage();

// **Function to classify & color VPD values**
const classifyVPD = (vpd: number) => {
  if (vpd >= 0.8 && vpd <= 1.2) return { type: "success" }; // ✅ Optimal (Green)
  if (vpd < 0.8) return { type: "warning" }; // ⚠️ Sub-optimal (Yellow)
  return { type: "error" }; // ❌ Dangerous (Red)
};

// **Define Table Columns**
const columns: DataTableColumns<any> = [
  { title: "📅 Timestamp", key: "timestamp" },
  { title: "🌡️ Temperature (°C)", key: "temperature" },
  { title: "💧 Humidity (%)", key: "humidity" }, // ✅ Fixed Humidity Column
  {
    title: "🌫️ Air VPD (kPa)",
    key: "vpd_air",
    render(row) {
      return h(
        NTag,
        { type: classifyVPD(row.vpd_air).type, bordered: false },
        { default: () => `${row.vpd_air.toFixed(2)} kPa` }
      );
    },
  },
  {
    title: "🌿 Leaf VPD (kPa)",
    key: "vpd_leaf",
    render(row) {
      return h(
        NTag,
        { type: classifyVPD(row.vpd_leaf).type, bordered: false },
        { default: () => `${row.vpd_leaf.toFixed(2)} kPa` }
      );
    },
  },
];

// **WebSocket Connection**
const connectWebSocket = () => {
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    message.success("✅ WebSocket Connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      vpdData.value.unshift({
        timestamp: new Date().toLocaleTimeString(),
        temperature: data.temperature,
        humidity: data.humidity ?? 0, // ✅ Ensure Humidity is Mapped Correctly
        vpd_air: data.vpd_air,
        vpd_leaf: data.vpd_leaf,
      });

      // Keep only the last 20 entries for performance
      if (vpdData.value.length > 20) {
        vpdData.value.pop();
      }
    } catch (error) {
      message.error("⚠️ Failed to parse WebSocket data.");
    }
  };

  socket.onerror = () => {
    message.error("🚨 WebSocket Error: Connection Issue");
  };

  socket.onclose = () => {
    message.warning("🔌 WebSocket Disconnected. Reconnecting...");
    setTimeout(connectWebSocket, 3000);
  };
};

onMounted(connectWebSocket);
onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});
</script>
