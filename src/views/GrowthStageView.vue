<template>
  <n-card title="🌱 Select Plant Growth Stage" class="growth-stage">
    <n-space vertical>
      <n-radio-group v-model:value="selectedStage" size="large" @update:value="selectStage">
        <n-radio-button
          v-for="(range, stage) in vpdModes"
          :key="stage"
          :value="stage"
        >
          {{ capitalize(stage) }} ({{ range[0] }} - {{ range[1] }} kPa)
        </n-radio-button>
      </n-radio-group>
    </n-space>

    <n-divider />

    <n-alert v-if="selectedStage" type="success" show-icon>
      ✅ Selected: <strong>{{ capitalize(selectedStage) }}</strong>
    </n-alert>
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { setVpdTarget, getVpdTarget } from "../api"; // Ensure API calls

// Define VPD growth stages
const vpdModes: Record<string, [number, number]> = {
  propagation: [0.4, 0.8],
  vegetative: [1.1, 1.2],
  flowering: [1.2, 1.4],
};

const selectedStage = ref<string | null>(null);

// Function to determine stage based on API response
const getStageFromVpdRange = (min: number, max: number): string | null => {
  for (const [stage, range] of Object.entries(vpdModes)) {
    if (range[0] === min && range[1] === max) {
      return stage;
    }
  }
  return null; // No matching stage found
};

// Select and update VPD target
const selectStage = async (stage: string) => {
  selectedStage.value = stage;
  try {
    await setVpdTarget(stage);
  } catch (error) {
    console.error("Failed to set VPD target:", error);
  }
};

// Load current VPD stage on mount
onMounted(async () => {
  try {
    const { min, max } = await getVpdTarget();
    selectedStage.value = getStageFromVpdRange(min, max);
  } catch (error) {
    console.error("⚠️ Failed to fetch current VPD stage:", error);
  }
});

// Capitalize text for display
const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
</script>

<style scoped>
.growth-stage {
  max-width: 100%;
  margin: auto;
  text-align: center;
}
</style>
