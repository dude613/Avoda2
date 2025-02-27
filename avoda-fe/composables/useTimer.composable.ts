import type { ResponseObject } from '@/types/response-object.interface';

export const useTimeTracker = () => {
  const { post, patch, get } = useApi();

  // Store when the timer was started
  const timerStartTimestamp = useLocalStorage<number>(
    'TIMER_START_TIMESTAMP',
    0
  );

  // Store total paused time to account for pauses
  const totalPausedTime = useLocalStorage<number>('TIMER_TOTAL_PAUSED_TIME', 0);

  // Store when the timer was paused (0 if not paused)
  const pausedAtTimestamp = useLocalStorage<number>('TIMER_PAUSED_AT', 0);

  const intervalId = ref<NodeJS.Timeout | null>(null);
  const isLoading = ref(false);
  const currentEntry = useLocalStorage<string>('TIMER_DATA', null);
  const timeElapsed = ref(0);

  const entry = computed({
    get() {
      return currentEntry.value ? JSON.parse(currentEntry.value) : null;
    },
    set(value: any) {
      currentEntry.value = value ? JSON.stringify(value) : null;
    },
  });

  const isRunning = computed(() => {
    return timerStartTimestamp.value > 0 && pausedAtTimestamp.value === 0;
  });

  const isPaused = computed(() => {
    return pausedAtTimestamp.value > 0;
  });

  // Format the time as HH:MM:SS
  const displayTime = computed(() => {
    const hours = Math.floor(timeElapsed.value / 3600);
    const minutes = Math.floor((timeElapsed.value % 3600) / 60);
    const seconds = timeElapsed.value % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  });

  // Calculate elapsed time based on timestamps
  const calculateElapsedTime = () => {
    const now = Math.floor(new Date().getTime() / 1000);

    if (entry.value && entry.value.status === 'paused') {
      timerStartTimestamp.value = Math.floor(
        new Date(entry.value.startTime).getTime() / 1000
      );
      pausedAtTimestamp.value = Math.floor(
        new Date(entry.value.lastPausedAt).getTime() / 1000
      );
      totalPausedTime.value = Math.floor(
        new Date(entry.value.totalPausedTime).getTime() / 1000
      );
    }

    // Timer never started or was reset
    if (timerStartTimestamp.value === 0) return 0;

    if (pausedAtTimestamp.value > 0) {
      // Timer is paused - use the time when it was paused
      return (
        pausedAtTimestamp.value -
        timerStartTimestamp.value -
        totalPausedTime.value
      );
    }

    // Timer is running - calculate based on current time
    return now - timerStartTimestamp.value - totalPausedTime.value;
  };

  // Update elapsed time (called by interval)
  const updateElapsedTime = () => {
    timeElapsed.value = calculateElapsedTime();
  };

  const startTimer = async () => {
    try {
      isLoading.value = true;
      const response = await post<Record<string, any>>(
        '/organizations/:id/time-entry'
      );

      // update the current time log
      entry.value = response.data;

      // Reset and store current timestamp as start time
      const now = Math.floor(new Date().getTime() / 1000);
      timerStartTimestamp.value = now;
      pausedAtTimestamp.value = 0;
      totalPausedTime.value = 0;

      // Start local timer for UI updates
      startInterval();
    } catch (error) {
      console.error('Failed to start timer:', error);
    } finally {
      isLoading.value = false;
    }
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

      // Reset all values
      timerStartTimestamp.value = 0;
      pausedAtTimestamp.value = 0;
      totalPausedTime.value = 0;
      timeElapsed.value = 0;

      // Stop local timer
      stopInterval();
    } catch (error) {
      console.error('Failed to stop timer:', error);
    } finally {
      isLoading.value = false;
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

      // Record when we paused
      pausedAtTimestamp.value = Math.floor(new Date().getTime() / 1000);

      // Stop local timer interval (UI updates only)
      stopInterval();
    } catch (error) {
      console.error('Failed to pause timer:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const resumeTimer = async () => {
    if (pausedAtTimestamp.value > 0) {
      try {
        isLoading.value = true;
        const response = await patch<Record<string, any>>(
          `/organizations/:id/time-entry/resume`,
          { id: entry.value.id }
        );

        // update the current time log
        entry.value = response.data;

        // Calculate how much time was spent paused and add to total paused time
        const now = Math.floor(new Date().getTime() / 1000);
        totalPausedTime.value += now - pausedAtTimestamp.value;

        // Clear the paused timestamp
        pausedAtTimestamp.value = 0;

        // Start local timer again for UI updates
        startInterval();
      } catch (error) {
        console.error('Failed to resume timer:', error);
      } finally {
        isLoading.value = false;
      }
    }
  };

  const startInterval = () => {
    stopInterval();
    updateElapsedTime(); // Update immediately when starting
    intervalId.value = setInterval(updateElapsedTime, 1000);
  };

  const stopInterval = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
  };

  const checkActiveTimer = async () => {
    try {
      isLoading.value = true;

      if (entry.value) {
        switch (entry.value.status) {
          case 'started':
            startInterval();
            break;
          case 'paused':
            const now = Math.floor(new Date().getTime() / 1000);
            totalPausedTime.value += now - pausedAtTimestamp.value;
            pausedAtTimestamp.value = 0;
            startInterval();
            break;
          case 'stopped':
            timerStartTimestamp.value = 0;
            pausedAtTimestamp.value = 0;
            totalPausedTime.value = 0;
            timeElapsed.value = 0;
            stopInterval();
            break;
        }
      }
    } catch (error) {
      console.error('Failed to check active timer:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Clean up the interval when the component is unmounted
  const cleanup = () => {
    // We only need to clear the interval - we don't reset the timer values
    // since we want them to persist across navigation
    stopInterval();
  };

  const getActiveTimer = async () => {
    const res = await get<ResponseObject<Record<string, any>>>(
      `/organizations/:id/time-entry/active`
    );

    entry.value = res.data;
  };

  onMounted(async () => {
    // fetch active timer
    await getActiveTimer();

    // On mount, calculate and display the correct time
    updateElapsedTime();

    // Start the interval if the timer is running
    // if (isRunning.value) {
    //   startInterval();
    // }

    // Check with server for the current state
    checkActiveTimer();
  });

  onBeforeUnmount(() => {
    cleanup();
  });

  return {
    isRunning,
    isPaused,
    displayTime,
    isLoading,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    cleanup,
  };
};
