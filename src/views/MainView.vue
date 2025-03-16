<template>
  <div class="main-view">
    <ControlOptimization />
    <DeviceStatus />
    <PredictedDeviceStates />
    <RealTimeVpd />
  </div>
</template>

<script setup lang="ts">
import ControlOptimization from "../components/ControlOptimization.vue";
import DeviceStatus from "../components/DeviceStatus.vue";
import PredictedDeviceStates from "../components/PredictedDeviceStates.vue";
import RealTimeVpd from "../components/RealTimeVpd.vue";
</script>

<style scoped lang="scss">
.main-view > div {
  margin-bottom: 16px;
}
</style>
