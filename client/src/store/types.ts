/**
 * The main state of the application
 */
export interface State {
  /**
   * Store current user data, both while offline in localstorage or online
   */
  user: User | null;
  /**
   * Store the last sync status of the user, stored under localStorage
   * Use this to check the last sync status with the server, and act accordingly
   */
  localSyncStatus: SyncStatus;
  /**
   * The synchronization stage of the app and user, for information purpose
   */
  syncState: SyncState;
  /**
   * Store the assets that only gets uploaded locally, stored under localStorage
   */
  pendingAssets: PendingLottie[];
  /**
   * Store the assets that already sync with the server
   */
  assets: Lottie[];
  /**
   * Store the selected asset to be viewed in the Detail page
   */
  viewAsset: ViewLottie | null;
  /**
   * Store the criteria to filter the assets, and to be referred in the creation query as well
   */
  criteria: Criteria;
  /**
   * Store the notification to be displayed in the floating Notification Card
   */
  notification: Notification | null;
  /**
   * Store the last action that triggers the state change, for debugging or subscription purpose
   */
  action: StateAction | null;

  /**
   * Further on, are the "Actions" that can be used to change the state.
   */

  setUser: (user: User | null) => void;
  setAssets: (assets: Lottie[]) => void;
  setCriteria: (criteria: Criteria) => void;
  setViewAsset: (asset: ViewLottie | null) => void;
  setPendingAssets: (assets: PendingLottie[]) => void;
  setLocalSyncStatus: (data: SyncStatus) => void;
  setSyncState: (state: SyncState) => void;
  setNotification: (notification: Notification | null) => void;
}

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
  user: string;
}

export interface SyncStatus {
  lastUpdate: string;
  name: string;
}

export enum LottieStorage {
  USER = "lottie-user",
  PENDING_ASSETS = "lottie-pending-assets",
  LOCAL_SYNC_STATUS = "lottie-local-sync-status",
}

export interface PendingLottie {
  id: number;
  title: string;
  dataUrl: string;
  isPending: boolean;
  criteria: Criteria;
  createdAt: string;
  user: string;
}

export interface ViewLottie {
  title: string;
  user: string;
  fileUrl: string;
}

export interface Notification {
  severity: AlertColor;
  message: string;
}

export enum SyncState {
  NO_SYNC = "no-sync",
  UP_TO_DATE = "up-to-date",
  NEED_UPDATE = "need-update",
  SYNCING = "syncing",
  FAIL_TO_SYNC = "fail-to-sync",
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

export enum Criteria {
  ALL = "All",
  GAME = "Game",
  NATURE = "Nature",
  PEOPLE = "People",
  SCIENCE = "Science",
  TECH = "Tech",
  SHAPE = "Shape",
}

export type AlertColor = "success" | "info" | "warning" | "error";
