import { GET_LAST_SYNC_STATUS } from '../repo/graph';
import { client } from '../apollo-client';
import { useStateLocalSyncStatus, useStateSetLocalSyncStatus } from '../store/syncStatus';
import { useEffect, useMemo, useState } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import { useSyncPendingAssets } from '../service/useSyncPendingAssets';
import { useLoadAssets } from '../service/useLoadAssets';

export const SyncStatus = () => {
  const localSyncStatus = useStateLocalSyncStatus();
  const setLocalSyncStatus = useStateSetLocalSyncStatus();
  const syncPendingAssets = useSyncPendingAssets();
  const loadAssets = useLoadAssets();
  const [isLoading, setIsLoading] = useState(false);
  const lastSyncMessage = useMemo(() => {
    if (localSyncStatus.lastUpdate) {
      return `Last Update ${ formatRelative(parseISO(localSyncStatus.lastUpdate), new Date()) } by ${localSyncStatus.name}`;
    } else {
      return 'No update yet.';
    }
  }, [localSyncStatus]);

  const refreshStatus = async () => {
    const result = await client.query({
      query: GET_LAST_SYNC_STATUS,
      fetchPolicy: 'no-cache',
    }).then(async ({ data }) => {
      const syncStatus = data.lastSyncStatus[0];
      if (syncStatus) {
        if (syncStatus.lastUpdate !== localSyncStatus.lastUpdate) {
          await loadAssets();
          setLocalSyncStatus({
            lastUpdate: syncStatus.lastUpdate,
            name: syncStatus.user.name,
          });
        }
      } else {
        // TODO: Notify the user that they are already sync to the latest
        console.log('Already sync to the latest');
      }
    });
    return result;
  };

  const synchronize = async () => {
    setIsLoading(true);
    try {
      await syncPendingAssets();
      await refreshStatus();  
    } catch (e) {
      // TODO: Notify the user
      console.error('Fail to synchronize', e);
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    synchronize()
  }, []);

  return (
    <div className='text-right'>
      <div className="text-sm text-blue-500 italic">{lastSyncMessage}</div>
      <button
        className="button-shadow emerald"
        onClick={synchronize}
        disabled={isLoading}>
        { isLoading ? '...' : 'Sync' }
      </button>
    </div>
  )
}