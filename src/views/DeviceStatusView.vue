<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getDeviceStatus, getDeviceInfo } from "../api";

const deviceStatusData = ref({});
const deviceInfoData = ref({});

const fetchDeviceStatus = async () => {
  deviceStatusData.value = await getDeviceStatus();
};

const fetchDeviceInfo = async () => {
  deviceInfoData.value = await getDeviceInfo();
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
