<template>
  <n-config-provider>
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useSettingsStore } from "./stores/settings.store";
const settingStore = useSettingsStore();

onMounted(async () => settingStore.fetchConfigSettings);
</script>

<style lang="scss">
#app {
  text-align: center;
}

nav {
  padding: 30px;
}
</style>
