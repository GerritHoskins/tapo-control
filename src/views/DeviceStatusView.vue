<script setup lang="ts">
import { inject, ref, onMounted } from "vue";

const api = inject("api");
const deviceStatusData = ref({});
const deviceInfoData = ref({});

const fetchDeviceStatus = async () => {
  deviceStatusData.value = await api.getDeviceStatus();
};

const fetchDeviceInfo = async () => {
  deviceStatusData.value = await api.getDeviceInfo();
};

onMounted(async () => {
  await fetchDeviceStatus();
  await fetchDeviceInfo();
});
</script>

<template>
  <div>
    <h1>Device Status</h1>
    <button @click="fetchDeviceStatus">Refresh</button>
    <pre>{{ deviceStatusData }}</pre>
  </div>
</template>
