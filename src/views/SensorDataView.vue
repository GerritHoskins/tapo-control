<script setup lang="ts">
import { inject, ref, onMounted } from "vue";

const api = inject("api");
const sensorData = ref({});

const fetchSensorData = async () => {
  sensorData.value = await api.getSensorData();
};

onMounted(fetchSensorData);
</script>

<template>
  <div>
    <h1>Sensor Data</h1>
    <button @click="fetchSensorData">Refresh</button>
    <pre>{{ sensorData }}</pre>
  </div>
</template>
