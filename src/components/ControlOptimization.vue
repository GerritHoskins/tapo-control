<template>
  <n-card title="🧠 AI-Optimized Control">
    <n-alert v-if="bestAction" type="info" show-icon>
      🔧 Recommended Action: <strong>{{ bestAction }}</strong>
    </n-alert>
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getOptimizedControl, getPredictionData } from "../api";
import { useMessage } from "naive-ui";
import type { SensorData } from "../api";

const message = useMessage();

const bestAction = ref<string | null>(null);
const sensorData = ref<SensorData>({
  temperature: 25,
  leaf_temperature: 24,
  humidity: 55,
  vpd_air: 1.2,
  vpd_leaf: 1.0,
});

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

const fetchOptimization = async () => {
  bestAction.value = await getOptimizedControl(sensorData.value);
};

onMounted(async () => {
  await fetchPredictionData();
  await fetchOptimization();
});
</script>
