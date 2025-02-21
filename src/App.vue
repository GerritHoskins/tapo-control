<template>
  <nav>
    <router-link to="/device-status">Device Status</router-link> |   
    <router-link to="/predict">ML Predictions</router-link> |
    <router-link to="/real-time-vpd">Real Time VPD</router-link>
  </nav>
  <n-config-provider>
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="scss">
#app {
  text-align: center;
}

nav {
  padding: 30px;
}
</style>
