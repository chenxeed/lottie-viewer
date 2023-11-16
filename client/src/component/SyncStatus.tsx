import { useStateLocalSyncStatus } from '../store/syncStatus';
import { useCallback, useMemo, useState } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import { useSyncPendingAssets } from '../service/useSyncPendingAssets';
import { useSyncUser } from '../service/useSyncUser';
import clsx from 'clsx';
import { useStateUser } from '../store/user';
import { useSyncAssets } from '../service/useSyncAssets';
import { useStateSyncState } from '../store/assets';
import { SyncState } from '../store/types';

export const SyncStatus = () => {
  
  const user = useStateUser();
  const syncUser = useSyncUser();
  const syncPendingAssets = useSyncPendingAssets();

  const localSyncStatus = useStateLocalSyncStatus();

  const syncAssets = useSyncAssets();
  const [isLoading, setIsLoading] = useState(false);

  const syncState = useStateSyncState();

  const handleSynchronize = useCallback(async () => {
    setIsLoading(true);
    try {
      // Sync the user state, in case the user was created during offline mode
      if (user) {
        await syncUser(user);
      }

      // Sync the pending assets, in case the user created assets during offline mode
      await syncPendingAssets();

      // Sync the latest assets from the server, by checking the last sync status
      await syncAssets();
    } catch (e) {
      // TODO: Notify the user
      console.error('Fail to synchronize', e);
    } finally {
      setIsLoading(false);      
    }

  }, []);

  const lastSyncMessage = useMemo(() => {
    if (syncState === SyncState.SYNCING) {
      return `Synching... Please wait`;
    } else if (syncState === SyncState.UP_TO_DATE) {
      return `Last Update ${ formatRelative(parseISO(localSyncStatus.lastUpdate), new Date()) } by ${localSyncStatus.name}`;
    } else if (syncState === SyncState.NO_SYNC) {
      return 'No update yet.';
    } else if (syncState === SyncState.FAIL_TO_SYNC) {
      return 'Fail to sync. Please try again.';
    } else {
      return 'Unknown status';
    }
  }, [syncState, localSyncStatus]);


  return (
    <div className='text-right'>
      <div className="text-sm text-blue-500 italic">{lastSyncMessage}</div>
      <button
        className={clsx("button-shadow emerald", isLoading && 'animate-pulse')}
        onClick={handleSynchronize}
        disabled={isLoading}>
        { isLoading ? '...' : 'Sync' }
      </button>
    </div>
  )
}