<template>
  <div class="growth-stage">
    <h2>🌱 Select Plant Growth Stage</h2>
    <div v-for="(range, stage) in vpdModes" :key="stage" class="option">
      <button
        :class="{ selected: selectedStage === stage }"
        @click="selectStage(stage)"
      >
        {{ capitalize(stage) }} ({{ range[0] }} - {{ range[1] }} kPa)
      </button>
    </div>
    <p v-if="selectedStage" class="success">
      ✅ Selected: {{ capitalize(selectedStage) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { setVpdTarget } from "../api";

const vpdModes: Record<string, [number, number]> = {
  propagation: [0.4, 0.8],
  vegetative: [1.1, 1.2],
  flowering: [1.2, 1.4],
};

const selectedStage = ref<string | null>(null);

const selectStage = async (stage: string) => {
  selectedStage.value = stage;
  try {
    await setVpdTarget(stage);
  } catch (error) {
    console.error("Failed to set VPD target:", error);
  }
};

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
</script>

<style scoped>
.growth-stage {
  text-align: center;
}

.option button {
  padding: 10px;
  margin: 5px;
  border: none;
  cursor: pointer;
  background-color: #f0f0f0;
  transition: 0.3s;
}

.option button:hover {
  background-color: #ddd;
}

.option .selected {
  background-color: #4caf50;
  color: white;
}

.success {
  margin-top: 10px;
  color: green;
}
</style>
