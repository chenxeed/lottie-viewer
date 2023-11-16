import { useLazyQuery } from "@apollo/client";
import { client } from "./apolloClient";
import { GET_ASSETS, GET_LAST_SYNC_STATUS } from "../repo/graph";
import { useStateLocalSyncStatus, useStateSetLocalSyncStatus } from "../store/syncStatus";
import { Criteria, SyncState } from "../store/types";
import { useStateAssets, useStateCriteria, useStateSetAssets, useStateSetSyncState } from "../store/assets";

export function useSyncAssets () {

  const localSyncStatus = useStateLocalSyncStatus();
  const setLocalSyncStatus = useStateSetLocalSyncStatus();
  const [getSyncStatus] = useLazyQuery(GET_LAST_SYNC_STATUS, {
    client,
    fetchPolicy: 'no-cache',
  });

  const assets = useStateAssets();
  const setAssets = useStateSetAssets();
  const criteria = useStateCriteria();
  const setSyncState = useStateSetSyncState();
  const [getAssets] = useLazyQuery(GET_ASSETS, {
    client,
    fetchPolicy: 'network-only',
  });

  return async () => {
    setSyncState(SyncState.SYNCING);
    const result = await getSyncStatus();
    if (result.data) {
      const syncStatus = result.data.lastSyncStatus[0];
      if (syncStatus) {
        if (syncStatus.lastUpdate !== localSyncStatus.lastUpdate) {
          // Upon sync, we just request the newer assets from the currently loaded assets
          // by passing the last asset ID as the cursor
          // Synchronize assets
          const result = await getAssets({
            variables: {
              criteria: criteria === Criteria.ALL ? undefined : criteria,
              after: assets.length ? assets[0].id : 0,
            }
          });
          if (result.data) {
            setAssets(
              [
                ...result.data.assets.map((asset: any) => ({
                  id: asset.id,
                  title: asset.title,
                  file: asset.file,
                  createdAt: asset.createdAt,
                })),
                ...(assets.length ? assets : []),
              ]);
            setLocalSyncStatus({
              name: syncStatus.user.name,
              lastUpdate: syncStatus.lastUpdate,
            })
            setSyncState(SyncState.UP_TO_DATE);
          } else {
            setSyncState(SyncState.FAIL_TO_SYNC);
          }
        }
      } else {
        setSyncState(SyncState.UP_TO_DATE);
      }
    } else {
      setSyncState(SyncState.FAIL_TO_SYNC);
    }
  }
}