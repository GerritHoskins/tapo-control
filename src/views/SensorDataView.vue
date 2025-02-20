<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSensorData } from "../api";

const sensorData = ref({});

const fetchSensorData = async () => {
  sensorData.value = await getSensorData();
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
