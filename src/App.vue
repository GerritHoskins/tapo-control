<template>
  <nav>
    <router-link to="/device-status">Device Status</router-link> |
    <router-link to="/control-panel">Control Panel</router-link> |
    <router-link to="/sensor-data">Sensor Data</router-link> |
    <router-link to="/real-time-vpd">Real Time VPD</router-link> |
    <router-link to="/growth-stage">Growth Stage</router-link>
  </nav>
  <n-config-provider>
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
  import { NConfigProvider, GlobalThemeOverrides } from 'naive-ui'

  const themeOverrides: GlobalThemeOverrides = {
    common: {
      primaryColor: 'rgb(24, 24, 28)'
    },
    Card: {
      backgroundColor: 'rgb(24, 24, 28)'
    }
  }
</script>

<style lang="scss">
#app {
  text-align: center;
}

nav {
  padding: 30px;
}
</style>
