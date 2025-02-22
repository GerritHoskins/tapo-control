<template>
  <n-card title="🔮 Predicted Device States" class="prediction-card">
    <n-space vertical>
      <n-button type="primary" @click="predict"> 🔄 Get Predictions </n-button>
      <n-button type="primary" @click="predict"> 🔄 Get Predictions </n-button>
      <n-data-table
        :columns="columns"
        :data="predictedData"
        :bordered="true"
        :pagination="pagination"
      />
    </n-space>
  </n-card>
  <n-card title="🚨 Anomaly Detection" class="anomaly-card">
    <n-space vertical>
      <n-alert
        v-if="isAnomaly !== null"
        :type="isAnomaly ? 'error' : 'success'"
        show-icon
      >
        <strong v-if="isAnomaly">⚠️ Anomaly Detected!</strong>
        <strong v-else>✅ No Anomaly Detected</strong>
      </n-alert>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from "vue";
import { NTag, NButton, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { getPredictedStates, getPredictionData, detectAnomaly, getPredictedAction } from "../api";
import type { SensorData } from "../api";

const message = useMessage();
const predictedData = ref<Array<{ device: string; state: boolean }>>([]);
const pagination = ref({ pageSize: 5, showSizePicker: false });
const isAnomaly = ref<boolean | null>(null);
const sensorData = ref<SensorData>({
  temperature: 25.3,
  leaf_temperature: 24.3,
  humidity: 57,
  vpd_air: 1.2,
  vpd_leaf: 1.1,
});

const columns: DataTableColumns<any> = [
  { title: "🖥️ Device", key: "device" },
  {
    title: "📡 Predicted State",
    key: "state",
    render(row) {
      return row.state
        ? h(NTag, { type: "success", bordered: false }, { default: () => "ON" })
        : h(NTag, { type: "error", bordered: false }, { default: () => "OFF" });
    },
  },
];

const fetchAnomalyStatus = async () => {
  isAnomaly.value = await detectAnomaly(sensorData.value);
};

const predict = async () => {
  await fetchPredictionData();
  await fetchPredictions();
  await fetchAnomalyStatus();
  await getPredictedAction(sensorData.value)
};

const fetchPredictions = async () => {
  try {
    const response = await getPredictedStates(sensorData.value);
    if (response) {
      predictedData.value = [
        { device: "Exhaust", state: response.exhaust },
        { device: "Humidifier", state: response.humidifier },
        { device: "Dehumidifier", state: response.dehumidifier },
      ];
      message.success("✅ Predictions updated!");
    } else {
      message.error("⚠️ Failed to retrieve predictions.");
    }
  } catch (error) {
    console.error("Error fetching predictions:", error);
    message.error("❌ API error occurred.");
  }
};

const fetchPredictionData = async () => {
  try {
    const response = await getPredictionData();
    if (response) {
      sensorData.value = response as SensorData;
      message.success("✅ Predictions data received!");
    } else {
      message.error("⚠️ Failed to retrieve prediction data.");
    }
  } catch (error) {
    console.error("Error fetching prediction data:", error);
    message.error("❌ API error occurred.");
  }
};

onMounted(async () => {
  await predict();
});
</script>

<style scoped>
.prediction-card,
.anomaly-card {
  max-width: 100%;
  margin: auto;
  text-align: center;
}

.anomaly-card {
  margin-top: 16px;
}
</style>
