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
      return `Last sync: ${ formatRelative(parseISO(localSyncStatus.lastUpdate), new Date()) } by ${localSyncStatus.name}`;
    } else {
      return 'No sync yet.';
    }
  }, [localSyncStatus]);

  const refreshStatus = () => {
    return client.query({
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
    }).catch(err => {
      // TODO: Notify the user
      console.error('Fail to sync the status', err);
    }).finally(() => setIsLoading(false));
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
    <div className='flex'>
      <div>{lastSyncMessage}</div>
      <button
        className="bg-blue-500 hover:bg-blue-400 w-32 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={synchronize}
        disabled={isLoading}>
        { isLoading ? 'Processing...' : 'Sync' }
      </button>
    </div>
  )
}