import { User, Lottie } from "../types";
import { create } from 'zustand'
import { State, StateAction } from "./types";

export const useStore = create<State>((set) => ({
  user: null,
  assets: [],
  action: null,
  setUser: (user: User | null) => {
    set({ user, action: StateAction.SET_USER });
  },
  setAssets: (assets: Lottie[]) => {
    set({ assets, action: StateAction.SET_ASSETS });
  },
}));
