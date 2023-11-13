import { User, Lottie, LottieStorage } from "../types";
import { create } from 'zustand'

interface State {
  user: User | null;
  assets: Lottie[];
  setUser: (user: User | null) => void;
  setAssets: (assets: Lottie[]) => void;
}

const initialUser = localStorage.getItem(LottieStorage.USER);
const initialAssets = localStorage.getItem(LottieStorage.ASSETS);

export const useStore = create<State>((set) => ({
  user: initialUser ? JSON.parse(initialUser) : null,
  assets: initialAssets ? JSON.parse(initialAssets) : [],
  setUser: (user: User | null) => {
    set({ user });
    localStorage.setItem(LottieStorage.USER, JSON.stringify(user));
  },
  setAssets: (assets: Lottie[]) => {
    set({ assets })
    localStorage.setItem(LottieStorage.ASSETS, JSON.stringify(assets));
  },
}));