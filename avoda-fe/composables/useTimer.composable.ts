export const useTimeTracker = () => {
  const { post, patch, get } = useApi();

  const timeElapsed = useLocalStorage<number>('SAVED_TIME', 0, {
    initOnMounted: true,
  });

  const intervalId = ref<NodeJS.Timeout | null>(null);

  const isLoading = ref(false);

  const currentEntry = useLocalStorage<string>('TIMER_DATA', null);

  const entry = computed({
    get() {
      return JSON.parse(currentEntry.value);
    },
    set(value: any) {
      currentEntry.value = JSON.stringify(value);
    },
  });

  const isRunning = ref(false);
  const isPaused = ref(false);

  // Format the time as HH:MM:SS
  const displayTime = computed(() => {
    const hours = Math.floor(timeElapsed.value / 3600);
    const minutes = Math.floor((timeElapsed.value % 3600) / 60);
    const seconds = timeElapsed.value % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  });

  const updateElapsedTime = () => {
    timeElapsed.value++;
  };

  const startTimer = async () => {
    // if (!isRunning.value && !isPaused.value) {
    try {
      isLoading.value = true;
      const response = await post<Record<string, any>>(
        '/organizations/:id/time-entry'
      );

      // update the current time log
      entry.value = response.data;

      isRunning.value = entry.value.status === 'started';

      // Start local timer
      startInterval();
    } catch (error) {
      // TODO: Handle error appropriately
      console.error('Failed to start timer:', error);
    } finally {
      isLoading.value = false;
    }
    // }
  };

  const stopTimer = async () => {
    try {
      isLoading.value = true;
      const response = await patch<Record<string, any>>(
        `/organizations/:id/time-entry/stop`,
        { id: entry.value.id }
      );

      // update the current time log
      entry.value = response.data;

      isRunning.value = false;
      isPaused.value = false;

      // Stop local timer
      stopInterval();

      // reset time elapsed
      timeElapsed.value = 0;
    } catch (error) {
      // TODO: Handle error appropriately
      console.error('Failed to stop timer:', error);
    } finally {
      isLoading.value = false;
    }
  };
  const resumeTimer = async () => {
    if (isPaused.value) {
      try {
        isLoading.value = true;
        const response = await patch<Record<string, any>>(
          `/organizations/:id/time-entry/resume`,
          { id: entry.value.id }
        );

        // update the current time log
        entry.value = response.data;

        isPaused.value = false;
        isRunning.value = true;

        // Stop local timer
        startInterval();
      } catch (error) {
        // TODO: Handle error appropriately
        console.error('Failed to stop timer:', error);
      } finally {
        isLoading.value = false;
      }
    }
  };

  const pauseTimer = async () => {
    try {
      isLoading.value = true;
      const response = await patch<Record<string, any>>(
        `/organizations/:id/time-entry/pause`,
        { id: entry.value.id }
      );

      // update the current time log
      entry.value = response.data;

      isRunning.value = false;
      isPaused.value = true;

      // Pause local timer
      clearInterval(intervalId.value ?? undefined);
    } catch (error) {
      // TODO: Handle error appropriately
      console.error('Failed to stop timer:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const startInterval = () => {
    stopInterval();

    intervalId.value = setInterval(updateElapsedTime, 1000);
  };

  const stopInterval = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
  };

  const checkActiveTimer = async () => {
    if (entry.value) {
      try {
        isLoading.value = true;
        const res = await get<Record<string, any>>(
          `/organizations/:id/time-entry/${entry.value.id}`
        );

        if (res && res?.data) {
          entry.value = res.data;

          // Set the states using the current data when the page reloads
          isRunning.value = entry.value.status === 'started';
          isPaused.value = entry.value.status === 'paused';

          if (entry.value.status === 'started') {
            isRunning.value = true;
            startInterval();
          }
        }
      } catch (error) {
        console.error('Failed to check active timer:', error);
      } finally {
        isLoading.value = false;
      }
    }
  };

  // Clean up the interval when the component is unmounted
  const cleanup = () => {
    stopInterval();
  };

  onMounted(() => {
    checkActiveTimer();
  });

  onBeforeUnmount(() => {
    cleanup();
  });

  return {
    isRunning,
    isPaused,
    displayTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    cleanup,
    isLoading,
  };
};
