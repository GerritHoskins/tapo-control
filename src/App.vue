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

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
