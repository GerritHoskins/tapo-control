<script setup lang="ts">
import { inject, ref } from "vue";

const api = inject("api");
const deviceStatus = ref({});

const toggleDevice = async (device, state) => {
  deviceStatus.value = await api.toggleDevice(device, state);
};
</script>

<template>
  <div>
    <h1>Control Panel</h1>
    <button @click="toggleDevice('humidifier', 'on')">
      Turn Humidifier ON
    </button>
    <button @click="toggleDevice('humidifier', 'off')">
      Turn Humidifier OFF
    </button>
    <button @click="toggleDevice('exhaust', 'on')">Turn Exhaust ON</button>
    <button @click="toggleDevice('exhaust', 'off')">Turn Exhaust OFF</button>

    <pre>{{ deviceStatus }}</pre>
  </div>
</template>
