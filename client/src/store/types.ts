import { AlertColor } from "@mui/material";
import { User, Lottie, SyncStatus } from "../types";

export interface PendingLottie {
  id: number;
  title: string;
  dataUrl: string;
  isPending: boolean;
  criteria: Criteria;
  createdAt: string;
}

export interface ViewLottie {
  title: string;
  fileUrl: string;
}

export interface Notification {
  severity: AlertColor;
  message: string;
}

export enum SyncState {
  NO_SYNC = "no-sync",
  UP_TO_DATE = "up-to-date",
  SYNCING = "syncing",
  FAIL_TO_SYNC = "fail-to-sync",
}

export interface State {
  user: User | null;
  assets: Lottie[];
  pendingAssets: PendingLottie[];
  viewAsset: ViewLottie | null;
  criteria: Criteria;
  localSyncStatus: SyncStatus;
  syncState: SyncState;
  notification: Notification | null;
  action: StateAction | null;
  setUser: (user: User | null) => void;
  setAssets: (assets: Lottie[]) => void;
  setCriteria: (criteria: Criteria) => void;
  setViewAsset: (asset: ViewLottie | null) => void;
  setPendingAssets: (assets: PendingLottie[]) => void;
  setLocalSyncStatus: (data: SyncStatus) => void;
  setSyncState: (state: SyncState) => void;
  setNotification: (notification: Notification | null) => void;
}

export enum StateAction {
  SET_USER = "setUser",
  SET_ASSETS = "setAssets",
  SET_VIEW_ASSET = "setViewAssets",
  SET_CRITERIA = "setCriteria",
  SET_PENDING_ASSETS = "setPendingAssets",
  SET_LOCAL_SYNC_STATUS = "setLocalSyncStatus",
  SET_SYNC_STATE = "setSyncState",
  SET_NOTIFICATION = "setNotification",
}

export enum LottieStorage {
  USER = "lottie-user",
  PENDING_ASSETS = "lottie-pending-assets",
  LOCAL_SYNC_STATUS = "lottie-local-sync-status",
}

export enum Criteria {
  ALL = "All",
  GAME = "Game",
  NATURE = "Nature",
  PEOPLE = "People",
  SCIENCE = "Science",
  TECH = "Tech",
  SHAPE = "Shape",
}
