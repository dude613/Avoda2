<template>
  <div class="time-tracker">
    <div class="time-display">{{ displayTime }}</div>
    <div class="controls" v-if="!isLoading">
      <button
        v-if="!isRunning && !isPaused"
        @click="startTimer"
        class="start-btn"
      >
        Start
      </button>
      <button v-if="isRunning" @click="pauseTimer" class="pause-btn">
        Pause
      </button>
      <button v-if="isPaused" @click="resumeTimer" class="resume-btn">
        Resume
      </button>
      <button v-if="isRunning || isPaused" @click="stopTimer" class="stop-btn">
        Stop
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  isRunning,
  isPaused,
  displayTime,
  isLoading,
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
} = useTimeTracker();
</script>

<style scoped>
.time-tracker {
  padding: 2rem;
  text-align: center;
}

.time-display {
  font-size: 3rem;
  font-family: monospace;
  margin-bottom: 1rem;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.start-btn {
  background-color: #4caf50;
  color: white;
}

.pause-btn {
  background-color: #ffc107;
  color: black;
}

.resume-btn {
  background-color: #2196f3;
  color: white;
}

.stop-btn {
  background-color: #f44336;
  color: white;
}
</style>
