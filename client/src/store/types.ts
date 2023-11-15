import { User, Lottie, SyncStatus } from "../types";

export interface PendingLottie {
  id: number;
  title: string;
  jsonString: string;
  isPending: boolean;
  createdAt: string;
}

export interface ViewLottie {
  title: string;
  jsonString: string;
}

export interface State {
  user: User | null;
  assets: Lottie[];
  pendingAssets: PendingLottie[];
  viewAsset: ViewLottie | null;
  localSyncStatus: SyncStatus;
  action: StateAction | null;
  setUser: (user: User | null) => void;
  setAssets: (assets: Lottie[]) => void;
  setViewAsset: (asset: ViewLottie | null) => void;
  setPendingAssets: (assets: PendingLottie[]) => void;
  setLocalSyncStatus: (data: SyncStatus) => void;
}

export enum StateAction {
  SET_USER = 'setUser',
  SET_ASSETS = 'setAssets',
  SET_VIEW_ASSET = 'setViewAssets',
  SET_PENDING_ASSETS = 'setPendingAssets',
  SET_LOCAL_SYNC_STATUS = 'setLocalSyncStatus',
}

export enum LottieStorage {
  USER = 'lottie-user',
  ASSETS = 'lottie-assets',
  PENDING_ASSETS = 'lottie-pending-assets',
  LOCAL_SYNC_STATUS = 'lottie-local-sync-status',
}
