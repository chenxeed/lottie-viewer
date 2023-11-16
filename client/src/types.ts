import { Criteria } from "./store/types";

export interface User {
  id: number;
  name: string;
  isSync: boolean;
}

export interface Lottie {
  id: number;
  title: string;
  file: string;
  criteria: Criteria;
  createdAt: string;
}

export interface SyncStatus {
  lastUpdate: string;
  name: string;
}
