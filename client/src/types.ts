export interface User {
  id: number;
  name: string;
}

export interface Lottie {
  id: number;
  title: string;
  file: Record<string, any>;
  createdAt: string;
}

export interface SyncStatus {
  lastUpdate: string;
  name: string;
};