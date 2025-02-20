<script setup lang="ts">
import { ref } from "vue";
import { toggleDevice } from "../api";

const deviceStatus = ref({});

const toggleTapoDevice = async (device, state) => {
  deviceStatus.value = await toggleDevice(device, state);
};
</script>

<template>
  <div>
    <h1>Control Panel</h1>
    <button @click="toggleTapoDevice('humidifier', 'on')">
      Turn Humidifier ON
    </button>
    <button @click="toggleTapoDevice('humidifier', 'off')">
      Turn Humidifier OFF
    </button>
    <button @click="toggleTapoDevice('exhaust', 'on')">Turn Exhaust ON</button>
    <button @click="toggleTapoDevice('exhaust', 'off')">
      Turn Exhaust OFF
    </button>

    <pre>{{ deviceStatus }}</pre>
  </div>
</template>
