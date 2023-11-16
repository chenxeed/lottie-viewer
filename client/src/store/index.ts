import { User, Lottie, SyncStatus } from "../types";
import { create } from 'zustand'
import { Criteria, PendingLottie, State, StateAction, SyncState, ViewLottie } from "./types";

export const useStore = create<State>((set) => ({
  user: null,
  assets: [],
  pendingAssets: [],
  criteria: Criteria.ALL,
  viewAsset: null,
  localSyncStatus: {
    lastUpdate: '',
    name: '',
  },
  syncState: SyncState.NO_SYNC,
  notification: null,
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
}));
