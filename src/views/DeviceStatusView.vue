<script setup lang="ts">
import { inject, ref, onMounted } from "vue";

const api = inject("api");
const deviceStatusData = ref({});
const deviceInfoData = ref({});

const fetchDeviceStatus = async () => {
  deviceStatusData.value = await api.getDeviceStatus();
};

const fetchDeviceInfo = async () => {
  deviceInfoData.value = await api.getDeviceInfo();
};

const updateData = async () => {
  await fetchDeviceStatus();
  await fetchDeviceInfo();
};

onMounted(async () => updateData);
</script>

<template>
  <div>
    <h1>Device Info</h1>
    <button @click="updateData">Refresh</button>
    <pre>{{ deviceStatusData }}</pre>
    <pre>{{ deviceInfoData }}</pre>
  </div>
</template>
