<template>
  <n-config-provider>
    <n-card title="🌱 Select Plant Growth Stage" class="growth-stage">
      <n-space vertical>
        <n-radio-group
          v-model:value="selectedStage"
          size="large"
          @update:value="selectStage"
        >
          <n-radio-button
            v-for="(range, stage) in vpdModes"
            :key="stage"
            :value="stage"
          >
            {{ capitalize(stage.toString()) }} ({{ range[0] }} -
            {{ range[1] }} kPa)
          </n-radio-button>
        </n-radio-group>
      </n-space>

      <n-divider />

      <n-alert v-if="selectedStage" type="success" show-icon>
        ✅ Selected: <strong>{{ capitalize(selectedStage.toString()) }}</strong>
      </n-alert>
    </n-card>

    <n-card title="🔮 Real-Time VPD Monitoring" class="rt-vpd">
      <n-space vertical :size="12">
        <n-data-table
          :bordered="false"
          :columns="columns"
          :data="vpdData"
          :pagination="pagination"
        />
      </n-space>
    </n-card>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, h, onMounted, computed, onUnmounted } from "vue";
import { NTag, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { setVpdTarget, getVpdTarget } from "../api";
import type { VpdModes } from "../types/settings.interface";
import { useSettingsStore } from "../stores/settings.store";

const settingsStore = useSettingsStore();
const message = useMessage();

let socket: WebSocket | null = null;
const vpdData = ref<
  Array<{
    timestamp: string;
    temperature: number;
    humidity: number;
    vpd_air: number;
    vpd_leaf: number;
  }>
>([]);
const pagination = ref({
  pageSize: 1000,
  showSizePicker: false,
  pageSizes: [5, 10, 20],
  showQuickJumper: false,
});
const vpdModes = ref<VpdModes | null>(null);
const selectedStage = ref<keyof VpdModes | null>(null);

const selectStage = async (stage: keyof VpdModes) => {
  selectedStage.value = stage;
  try {
    await setVpdTarget(stage.toString());
  } catch (error) {
    console.error("⚠️ Failed to set VPD target:", error);
  }
};

const classifyVPD = (vpd: number) => {
  if (!selectedStage.value || !vpdModes.value) return { type: "default" };
  const VPD_TOLERANCE = settingsStore.config?.KPA_TOLERANCE ?? 0.05;
  const [vpdMin, vpdMax] = vpdModes.value[selectedStage.value];
  const minOptimal = vpdMin - VPD_TOLERANCE;
  const maxOptimal = vpdMax + VPD_TOLERANCE;
  return vpd >= minOptimal && vpd <= maxOptimal
    ? { type: "success" } // ✅ Optimal (Green)
    : vpd < minOptimal
    ? { type: "warning" } // ⚠️ Sub-optimal (Yellow)
    : { type: "error" }; // ❌ Dangerous (Red)
};

const columns: DataTableColumns<any> = [
  { title: "📅 Timestamp", key: "timestamp" },
  { title: "🌡️ Temperature (°C)", key: "temperature" },
  { title: "💧 Humidity (%)", key: "humidity" },
  {
    title: "🌫️ Air VPD (kPa)",
    key: "vpd_air",
    render(row) {
      const vpdInfo = classifyVPD(row.vpd_air);
      return h(
        NTag,
        {
          type: vpdInfo.type as "success" | "warning" | "error" | "default",
          bordered: false,
        },
        { default: () => `${row.vpd_air.toFixed(2)} kPa` }
      );
    },
  },
  {
    title: "🌿 Leaf VPD (kPa)",
    key: "vpd_leaf",
    render(row) {
      const vpdInfo = classifyVPD(row.vpd_leaf);
      return h(
        NTag,
        {
          type: vpdInfo.type as "success" | "warning" | "error" | "default",
          bordered: false,
        },
        { default: () => `${row.vpd_leaf.toFixed(2)} kPa` }
      );
    },
  },
];

const connectWebSocket = (WS_URL: string) => {
  if (socket) {
    socket.close();
  }

  socket = new WebSocket(WS_URL);

  socket.onopen = () => message.success("✅ WebSocket Connected");

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      vpdData.value.unshift({
        timestamp: new Date().toLocaleTimeString(),
        temperature: data.temperature,
        humidity: data.humidity ?? 0,
        vpd_air: data.vpd_air,
        vpd_leaf: data.vpd_leaf,
      });

      // Keep only the last 20 entries for performance
      if (vpdData.value.length > 20) vpdData.value.pop();
    } catch (error) {
      message.error("⚠️ Failed to parse WebSocket data.");
    }
  };

  socket.onerror = () => message.error("🚨 WebSocket Error: Connection Issue");

  socket.onclose = () => {
    message.warning("🔌 WebSocket Disconnected. Reconnecting...");
    setTimeout(() => connectWebSocket(WS_URL), 3000);
  };
};

const getCurrentVpdTarget = async () => {
  try {
    const res = await getVpdTarget();
    if (res?.stage) selectedStage.value = res.stage;
  } catch (error) {
    console.error("⚠️ Failed to fetch current VPD stage:", error);
  }
};

const capitalize = computed(
  () => (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
);

onMounted(async () => {
  await settingsStore.fetchConfigSettings();
  vpdModes.value = settingsStore.config?.VPD_MODES || null;
  await getCurrentVpdTarget();

  if (settingsStore.config?.WS_URL) {
    connectWebSocket(settingsStore.config.WS_URL);
  }
});

onUnmounted(() => {
  if (socket) socket.close();
});
</script>

<style scoped>
.rt-vpd,
.growth-stage {
  max-width: 100%;
  margin: auto;
  text-align: center;
  margin-top: 16px;
}
</style>
