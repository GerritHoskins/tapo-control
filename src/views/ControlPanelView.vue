<script setup lang="ts">
import { ref } from "vue";
import { toggleDevice } from "../api";
import { useMessage } from "naive-ui";

// Naive UI message notifications
const message = useMessage();

// Define device states
const deviceStatus = ref<Record<string, boolean>>({
  humidifier: false,
  exhaust: false,
  dehumidifier: false,
});

// Function to toggle devices
const toggleTapoDevice = async (device: string, state: "on" | "off") => {
  try {
    const response = await toggleDevice(device, state);
    deviceStatus.value[device] = state === "on";
    message.success(`${device.charAt(0).toUpperCase() + device.slice(1)} turned ${state.toUpperCase()}`);
  } catch (error) {
    message.error(`Failed to toggle ${device}`);
    console.error(error);
  }
};
</script>

<template>
  <n-card title="🔧 Device Control Panel">
    <n-space vertical :size="12">
      <!-- Humidifier Controls -->
      <n-button-group>
        <n-button @click="toggleTapoDevice('humidifier', 'on')" type="primary">
          💦 Turn Humidifier ON
        </n-button>
        <n-button @click="toggleTapoDevice('humidifier', 'off')" type="warning">
          ❌ Turn Humidifier OFF
        </n-button>
      </n-button-group>

      <!-- Exhaust Controls -->
      <n-button-group>
        <n-button @click="toggleTapoDevice('exhaust', 'on')" type="primary">
          🌬️ Turn Exhaust ON
        </n-button>
        <n-button @click="toggleTapoDevice('exhaust', 'off')" type="warning">
          ❌ Turn Exhaust OFF
        </n-button>
      </n-button-group>

      <!-- Dehumidifier Controls -->
      <n-button-group>
        <n-button @click="toggleTapoDevice('dehumidifier', 'on')" type="primary">
          🏜️ Turn Dehumidifier ON
        </n-button>
        <n-button @click="toggleTapoDevice('dehumidifier', 'off')" type="warning">
          ❌ Turn Dehumidifier OFF
        </n-button>
      </n-button-group>

      <!-- Device Status Display -->
      <n-divider />
      <n-alert type="info" title="Device Status" show-icon>
        <pre>{{ deviceStatus }}</pre>
      </n-alert>
    </n-space>
  </n-card>
</template>
