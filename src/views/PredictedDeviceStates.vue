<template>
  <n-card title="🔮 Predicted Device States" class="prediction-card">
    <n-space vertical>
      <n-button type="primary" @click="fetchPredictions">
        🔄 Get Predictions
      </n-button>

      <n-data-table
        :columns="columns"
        :data="predictedData"
        :bordered="true"
        :pagination="pagination"
      />
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NTag, NButton, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { getPredictedStates } from "../api";
import type { SensorData } from "../api";

const message = useMessage();
const predictedData = ref<Array<{ device: string; state: boolean }>>([]);
const pagination = ref({ pageSize: 5, showSizePicker: false });

// **Mock Sensor Data (Replace with Real Sensor Data)**
const sensorData: SensorData = {
  temperature: 25.3,
  leaf_temperature: 24.3, // ✅ Include Leaf Temperature
  humidity: 57,
  vpd_air: 1.2,
  vpd_leaf: 1.1,
};

// **Define Table Columns**
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

// **Fetch Predicted States from API**
const fetchPredictions = async () => {
  try {
    const response = await getPredictedStates(sensorData);
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
</script>

<style scoped>
.prediction-card {
  max-width: 600px;
  margin: auto;
  text-align: center;
}
</style>
