export function useToggle(value: boolean) {
  const isToggled = ref(value);

  const doToggle = () => (isToggled.value = !isToggled.value);

  return { isToggled, doToggle };
}
