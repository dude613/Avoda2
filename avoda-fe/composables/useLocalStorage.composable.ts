export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const nuxtApp = useNuxtApp();

  // Function to read from storage
  const readValue = (): T => {
    if (import.meta.client) {
      const item = localStorage.getItem(key);
      if (item != null) {
        return JSON.parse(item);
      }
    }
    return defaultValue;
  };

  // Function to write to storage
  const writeValue = (value: T): void => {
    if (import.meta.client) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  // Create a custom ref
  const customStorageRef = customRef<T>((track, trigger) => {
    let internalValue = readValue();

    return {
      get() {
        track();
        return internalValue;
      },
      set(newValue: T) {
        if (JSON.stringify(newValue) === JSON.stringify(internalValue)) {
          return;
        }
        internalValue = newValue;
        trigger();
        writeValue(newValue);
      },
    };
  });

  // Handle SSR by updating the value on client-side hydration
  if (import.meta.server) {
    nuxtApp.hook('app:created', () => {
      customStorageRef.value = readValue();
    });
  }

  // Ensure initial value is written to localStorage
  if (import.meta.client) {
    const initialValue = readValue();
    if (initialValue === defaultValue) {
      writeValue(defaultValue);
    }
  }

  return customStorageRef;
}
