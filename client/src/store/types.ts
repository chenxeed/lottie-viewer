import { User, Lottie } from "../types";

export interface State {
  user: User | null;
  assets: Lottie[];
  action: StateAction | null;
  setUser: (user: User | null) => void;
  setAssets: (assets: Lottie[]) => void;
}

export enum StateAction {
  SET_USER = 'setUser',
  SET_ASSETS = 'setAssets',
}

export enum LottieStorage {
  USER = 'lottie-user',
  ASSETS = 'lottie-assets',
}