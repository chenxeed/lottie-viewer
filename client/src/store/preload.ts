import { useStore } from ".";
import { LottieStorage, StateAction } from "./types";

// Initialize the preload state with the preload from localStorage
const initialPreload = localStorage.getItem(LottieStorage.PRELOAD);
useStore.setState((state) => ({
  ...state,
  preload: initialPreload ? JSON.parse(initialPreload) : null,
}));

useStore.subscribe((state) => {
  if (state.action === StateAction.SET_PRELOAD) {
    localStorage.setItem(LottieStorage.PRELOAD, JSON.stringify(state.preload));
  }
});

export const useStatePreload = () => useStore((state) => state.preload);
export const useStateSetPreload = () => useStore((state) => state.setPreload);
