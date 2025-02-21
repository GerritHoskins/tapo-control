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
            {{ capitalize(stage) }} ({{ range[0] }} - {{ range[1] }} kPa)
          </n-radio-button>
        </n-radio-group>
      </n-space>

      <n-divider />

      <n-alert v-if="selectedStage" type="success" show-icon>
        ✅ Selected: <strong>{{ capitalize(selectedStage) }}</strong>
      </n-alert>
    </n-card>
    <n-card title="🔮 Real Time Vpd" class="rt-vpd">
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
import { ref, h, onMounted, onUnmounted } from "vue";
import { NTag, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { setVpdTarget, getVpdTarget } from "../api";

let socket: WebSocket | null = null;
const WS_URL = "ws://localhost:8000/ws/vpd";
const VPD_TOLERANCE = 0.05;
const vpdData = ref<
  {
    timestamp: string;
    temperature: number;
    humidity: number;
    vpd_air: number;
    vpd_leaf: number;
  }[]
>([]);
const pagination = ref({
  pageSize: 1000,
  showSizePicker: false,
  pageSizes: [5, 10, 20],
  showQuickJumper: false,
});
const message = useMessage();
const vpdModes: Record<string, [number, number]> = {
  propagation: [0.4, 0.8],
  vegetative: [1.1, 1.2],
  flowering: [1.2, 1.4],
};
const selectedStage = ref<string | null>(null);

// Function to determine stage based on API response
const getStageFromVpdRange = (min: number, max: number): string | null => {
  for (const [stage, range] of Object.entries(vpdModes)) {
    if (range[0] === min && range[1] === max) {
      return stage;
    }
  }
  return null; // No matching stage found
};

// Select and update VPD target
const selectStage = async (stage: string) => {
  selectedStage.value = stage;
  try {
    await setVpdTarget(stage);
  } catch (error) {
    console.error("Failed to set VPD target:", error);
  }
};

// **Function to classify & color VPD values (with tolerance)**
const classifyVPD = (vpd: number) => {
  if (!selectedStage.value) return { type: "default" }; // Ensure a valid default return
  const [vpdMin, vpdMax] = vpdModes[selectedStage.value];
  const minOptimal = vpdMin - VPD_TOLERANCE;
  const maxOptimal = vpdMax + VPD_TOLERANCE;

  if (vpd >= minOptimal && vpd <= maxOptimal) return { type: "success" }; // ✅ Optimal (Green)
  if (vpd < minOptimal) return { type: "warning" }; // ⚠️ Sub-optimal (Yellow)
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
      const vpdInfo = classifyVPD(row.vpd_air) || { type: "default" }; // Default return
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
      const vpdInfo = classifyVPD(row.vpd_leaf) || { type: "default" }; // Default return
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

const getCurrentVpdTarget = async () => {
  try {
    const res = await getVpdTarget();
    //selectedStage.value = res.stage;
    if (res && res.stage) {
      console.log(res);
      //selectedStage.value = getStageFromVpdRange(res.min, res.max);
      selectedStage.value = res.stage;
    }
  } catch (error) {
    console.error("⚠️ Failed to fetch current VPD stage:", error);
  }
};

// Capitalize text for display
const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

onMounted(async () => {
  await getCurrentVpdTarget();
  connectWebSocket();
});

onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});
</script>

<style scoped>
.rt-vpd,
.growth-stage {
  max-width: 100%;
  margin: auto;
  text-align: center;
}
.rt-vpd {
  margin-top: 16px;
}
</style>
