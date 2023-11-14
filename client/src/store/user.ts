import { StateAction, LottieStorage } from './types';
import { useStore } from './';

// Initialize the user state with the user from localStorage
const initialUser = localStorage.getItem(LottieStorage.USER);
useStore.setState((state) => ({
  ...state,
  user: initialUser ? JSON.parse(initialUser) : null,
}));

useStore.subscribe((state) => {
  if (state.action === StateAction.SET_USER) {
    localStorage.setItem(LottieStorage.USER, JSON.stringify(state.user));
  }
});

export const useStateUser = () => useStore((state) => state.user);
export const useStateSetUser = () => useStore((state) => state.setUser);
