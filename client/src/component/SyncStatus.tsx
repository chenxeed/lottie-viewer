import { GET_LAST_SYNC_STATUS } from '../repo/graph';
import { client } from '../apollo-client';
import { useSyncStatusStore } from '../store/syncStatus';
import { useEffect, useMemo, useState } from 'react';
import { formatRelative, parseISO } from 'date-fns';

export const SyncStatus = () => {
  const { setServerSyncStatus, localSyncStatus } = useSyncStatusStore();
  const [isLoading, setIsLoading] = useState(false);
  const lastSyncMessage = useMemo(() => {
    if (localSyncStatus.lastUpdate) {
      return `Last sync: ${ formatRelative(parseISO(localSyncStatus.lastUpdate), new Date()) } by ${localSyncStatus.name}`;
    } else {
      return 'No sync yet.';
    }
  }, [localSyncStatus]);

  const refreshStatus = () => {
    setIsLoading(true);
    client.query({
      query: GET_LAST_SYNC_STATUS,
      fetchPolicy: 'no-cache',
    }).then(({ data }) => {
      const syncStatus = data.lastSyncStatus[0];
      if (syncStatus) {
        setServerSyncStatus({
          lastUpdate: syncStatus.lastUpdate,
          name: syncStatus.user.name,
        });  
      }
    }).finally(() => setIsLoading(false));
  }

  useEffect(refreshStatus, [setServerSyncStatus]);

  return (
    <div className='flex'>
      <div>{lastSyncMessage}</div>
      <button
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        onClick={refreshStatus}
        disabled={isLoading}>
        { isLoading ? 'Refreshing...' : 'Refresh' }
      </button>
    </div>
  )
}