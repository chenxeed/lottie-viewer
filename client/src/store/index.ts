import { create } from "zustand";
import {
  User,
  Lottie,
  SyncStatus,
  Criteria,
  PendingLottie,
  State,
  StateAction,
  SyncState,
  ViewLottie,
} from "./types";

/**
 * Application State Management using Zustand.
 *
 * Create a centralized store that holds the application state here.
 * Why choose Zustand for this app?
 * The nature of the app is to store multiple states like user, assets, and status,
 * to be easily accessible by components or hooks that need them.
 *
 * While Redux can achieve similar expectation, Zustand has more simpler API by
 * enabling us to create slices of the store, and import it directly in the components.
 *
 * Zustand also can ensure only the component that uses the store will be re-rendered,
 * not affecting the parent components, thus no need to pass through the props.
 *
 * For more detail about the state, please refer to src/store/types.ts
 */
export const useStore = create<State>((set) => ({
  user: null,
  assets: [],
  pendingAssets: [],
  criteria: Criteria.ALL,
  viewAsset: null,
  localSyncStatus: {
    lastUpdate: "",
    name: "",
  },
  syncState: SyncState.NO_SYNC,
  notification: null,
  preload: false,
  action: null,
  setUser: (user: User | null) => {
    set({ user, action: StateAction.SET_USER });
  },
  setAssets: (assets: Lottie[]) => {
    set({ assets, action: StateAction.SET_ASSETS });
  },
  setPendingAssets: (pendingAssets: PendingLottie[]) => {
    set({ pendingAssets, action: StateAction.SET_PENDING_ASSETS });
  },
  setCriteria: (criteria: Criteria) => {
    set({ criteria, action: StateAction.SET_CRITERIA });
  },
  setViewAsset: (asset: ViewLottie | null) => {
    set({ viewAsset: asset, action: StateAction.SET_ASSETS });
  },
  setLocalSyncStatus: (localSyncStatus: SyncStatus) => {
    set({ localSyncStatus, action: StateAction.SET_LOCAL_SYNC_STATUS });
  },
  setSyncState(state) {
    set({ syncState: state, action: StateAction.SET_SYNC_STATE });
  },
  setNotification(notification) {
    set({ notification, action: StateAction.SET_NOTIFICATION });
  },
  setPreload(preload) {
    set({ preload, action: StateAction.SET_PRELOAD });
  },
}));
