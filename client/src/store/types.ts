import { User, Lottie, SyncStatus } from "../types";

export interface PendingLottie extends Lottie {
  isPending: boolean;
}

export interface State {
  user: User | null;
  assets: Lottie[];
  pendingAssets: PendingLottie[];
  localSyncStatus: SyncStatus;
  serverSyncStatus: SyncStatus;
  action: StateAction | null;
  setUser: (user: User | null) => void;
  setAssets: (assets: Lottie[]) => void;
  setPendingAssets: (assets: PendingLottie[]) => void;
  setLocalSyncStatus: (data: SyncStatus) => void;
  setServerSyncStatus: (data: SyncStatus) => void;
}

export enum StateAction {
  SET_USER = 'setUser',
  SET_ASSETS = 'setAssets',
  SET_PENDING_ASSETS = 'setPendingAssets',
  SET_LOCAL_SYNC_STATUS = 'setLocalSyncStatus',
  SET_SERVER_SYNC_STATUS = 'setSyncStatus',
}

export enum LottieStorage {
  USER = 'lottie-user',
  ASSETS = 'lottie-assets',
  PENDING_ASSETS = 'lottie-pending-assets',
  LOCAL_SYNC_STATUS = 'lottie-local-sync-status',
  SERVER_SYNC_STATUS = 'lottie-server-sync-status',
}
