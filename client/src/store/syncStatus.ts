import { StateAction, LottieStorage } from './types';
import { useStore } from '.';

// Initialize the syncStatus state with the syncStatus from localStorage
const initialLocalSyncStatus = localStorage.getItem(LottieStorage.LOCAL_SYNC_STATUS);
useStore.setState((state) => ({
  ...state,
  localSyncStatus: initialLocalSyncStatus ? JSON.parse(initialLocalSyncStatus) : {
    lastUpdate: 0,
    name: '',
  },
}));

useStore.subscribe((state) => {
  if (state.action === StateAction.SET_LOCAL_SYNC_STATUS) {
    localStorage.setItem(LottieStorage.LOCAL_SYNC_STATUS, JSON.stringify(state.localSyncStatus));
  }
  if (state.action === StateAction.SET_SERVER_SYNC_STATUS) {
    // If the syncStatus is newer than the localSyncStatus, update the localSyncStatus
  }
});

export const useSyncStatusStore = () => {
  const localSyncStatus = useStore((state) => state.localSyncStatus);
  const setLocalSyncStatus = useStore((state) => state.setLocalSyncStatus);

  const serverSyncStatus = useStore((state) => state.serverSyncStatus);
  const setServerSyncStatus = useStore((state) => state.setServerSyncStatus);

  return {
    localSyncStatus,
    setLocalSyncStatus,
    serverSyncStatus,
    setServerSyncStatus
  }
}
