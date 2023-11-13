export interface User {
  id: number;
  name: string;
}

export interface Lottie {
  id: number;
  title: string;
  file: Record<string, any>;
}

export enum LottieStorage {
  USER = 'lottie-user',
  ASSETS = 'lottie-assets',
}