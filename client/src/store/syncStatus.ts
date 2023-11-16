import { StateAction, LottieStorage, SyncState } from './types';
import { useStore } from '.';

// Initialize the syncStatus state with the syncStatus from localStorage
const initialLocalSyncStatus = localStorage.getItem(LottieStorage.LOCAL_SYNC_STATUS);
useStore.setState((state) => ({
  ...state,
  localSyncStatus: initialLocalSyncStatus ? JSON.parse(initialLocalSyncStatus) : {
    lastUpdate: 0,
    name: '',
  },
  syncState: initialLocalSyncStatus ? SyncState.UP_TO_DATE : SyncState.NO_SYNC,
}));

useStore.subscribe((state) => {
  if (state.action === StateAction.SET_LOCAL_SYNC_STATUS) {
    localStorage.setItem(LottieStorage.LOCAL_SYNC_STATUS, JSON.stringify(state.localSyncStatus));
  }
});

export const useStateLocalSyncStatus = () => useStore((state) => state.localSyncStatus);
export const useStateSetLocalSyncStatus = () => useStore((state) => state.setLocalSyncStatus);
export const useStateSyncState = () => useStore((state) => state.syncState);
export const useStateSetSyncState = () => useStore((state) => state.setSyncState);
