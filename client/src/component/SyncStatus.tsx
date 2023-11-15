import { GET_LAST_SYNC_STATUS } from '../repo/graph';
import { client } from '../service/apolloClient';
import { useStateLocalSyncStatus, useStateSetLocalSyncStatus } from '../store/syncStatus';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import { useSyncPendingAssets } from '../service/useSyncPendingAssets';
import { useSyncUser } from '../service/useSyncUser';
import { useLoadAssets } from '../service/useLoadAssets';
import { useStateUser } from '../store/user';
import { useStateAssets, useStateCriteria, useStatePendingAssets, useStateSetAssets } from '../store/assets';
import clsx from 'clsx';

enum SyncState {
  NO_SYNC = 'no-sync',
  UP_TO_DATE = 'up-to-date',
  SYNCING = 'syncing',
  FAIL_TO_SYNC = 'fail-to-sync',
}

export const SyncStatus = () => {
  const localSyncStatus = useStateLocalSyncStatus();
  const user = useStateUser();
  const pendingAssets = useStatePendingAssets();
  const assets = useStateAssets();
  const criteria = useStateCriteria();
  const setLocalSyncStatus = useStateSetLocalSyncStatus();
  const setAssets = useStateSetAssets();
  const syncUser = useSyncUser();
  const syncPendingAssets = useSyncPendingAssets();
  const loadAssets = useLoadAssets();
  const [isLoading, setIsLoading] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>(SyncState.NO_SYNC);
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

  const synchronize = useCallback(async () => {
    const refreshStatus = async () => {
      const { data, errors } = await client.query({
        query: GET_LAST_SYNC_STATUS,
        fetchPolicy: 'no-cache',
      })
      if (data) {
        const syncStatus = data.lastSyncStatus[0];
        if (syncStatus) {
          if (syncStatus.lastUpdate !== localSyncStatus.lastUpdate) {
            setSyncState(SyncState.SYNCING);
            // Upon sync, we just request the newer assets from the currently loaded assets
            // by passing the last asset ID as the cursor
            const afterId = assets.length ? assets[0].id : 0;
            const { data, error } = await loadAssets({
              after: afterId,
              criteria,
            });
            if (error) {
              setSyncState(SyncState.FAIL_TO_SYNC);
            } else if (data) {
              setAssets(
                [
                  ...data.assets.map((asset: any) => ({
                    id: asset.id,
                    title: asset.title,
                    file: asset.file,
                    createdAt: asset.createdAt,
                  })),
                  ...(afterId > 0 ? assets : []),
                ]);  
              setLocalSyncStatus({
                lastUpdate: syncStatus.lastUpdate,
                name: syncStatus.user.name,
              });
              setSyncState(SyncState.UP_TO_DATE);  
            }

          }
        } else {
          setSyncState(SyncState.UP_TO_DATE);
          // TODO: Notify the user that they are already sync to the latest
          console.log('Already sync to the latest');
        };  
      } else if (errors) {
        setSyncState(SyncState.FAIL_TO_SYNC);
      }
    };

    setIsLoading(true);
    try {
      if (user) {
        await syncUser(user);
      }
      if (pendingAssets.length > 0) {
        await syncPendingAssets(pendingAssets);
      }
      await refreshStatus();  
    } catch (e) {
      // TODO: Notify the user
      console.error('Fail to synchronize', e);
    }finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className='text-right'>
      <div className="text-sm text-blue-500 italic">{lastSyncMessage}</div>
      <button
        className={clsx("button-shadow emerald", isLoading && 'animate-pulse')}
        onClick={synchronize}
        disabled={isLoading}>
        { isLoading ? '...' : 'Sync' }
      </button>
    </div>
  )
}