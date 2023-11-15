export interface User {
  id: number;
  name: string;
  isSync: boolean;
}

export interface Lottie {
  id: number;
  title: string;
  file: string;
  createdAt: string;
}

export interface SyncStatus {
  lastUpdate: string;
  name: string;
};