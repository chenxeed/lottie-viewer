import { useLazyQuery } from "@apollo/client";
import { client } from "./apolloClient";
import { GET_ASSETS, GET_LAST_SYNC_STATUS } from "../repo/graph";
import { useStateLocalSyncStatus, useStateSetLocalSyncStatus, useStateSetSyncState } from "../store/syncStatus";
import { Criteria, SyncState } from "../store/types";
import { useStateAssets, useStateCriteria, useStateSetAssets } from "../store/assets";
import { useRef } from "react";

export function useSyncAssets () {
  const localSyncStatus = useStateLocalSyncStatus();
  const localSyncStatusRef = useRef(localSyncStatus);
  localSyncStatusRef.current = localSyncStatus;
  const setLocalSyncStatus = useStateSetLocalSyncStatus();
  const [getSyncStatus] = useLazyQuery(GET_LAST_SYNC_STATUS, {
    client,
    fetchPolicy: 'no-cache',
  });

  const criteria = useStateCriteria();
  const criteriaRef = useRef(criteria);
  criteriaRef.current = criteria;

  const assets = useStateAssets();
  const assetsRef = useRef(assets);
  assetsRef.current = assets;
  const setAssets = useStateSetAssets();
  const setSyncState = useStateSetSyncState();
  const [getAssets] = useLazyQuery(GET_ASSETS, {
    client,
    fetchPolicy: 'network-only',
  });

  return async () => {
    setSyncState(SyncState.SYNCING);
    const syncStatusResult = await getSyncStatus();
    if (!syncStatusResult.data) {
      // User might be offline
      setSyncState(SyncState.FAIL_TO_SYNC);
      return;
    }
    const syncStatus = syncStatusResult.data.lastSyncStatus[0];
    if (!syncStatus) {
      // This could be the very first time when there's no sync status yet, thus back to original state
      setSyncState(SyncState.NO_SYNC);
      return;
    }
    if (syncStatus.lastUpdate === localSyncStatusRef.current.lastUpdate) {
      // User has already sync with the latest data
      setSyncState(SyncState.UP_TO_DATE);
      return;
    }
    // Upon sync, we just request the newer assets from the currently loaded assets
    // by passing the last asset ID as the cursor
    // Synchronize assets
    const assetsResult = await getAssets({
      variables: {
        criteria: criteriaRef.current === Criteria.ALL ? undefined : criteriaRef.current,
        after: assetsRef.current.length ? assetsRef.current[0].id : 0,
      }
    });
    if (!assetsResult.data) {
      // Fail to get the assets, user might be offline
      setSyncState(SyncState.FAIL_TO_SYNC);
      return;
    }
    // At this point, user has successfully sync with the server
    setAssets(
      [
        ...assetsResult.data.assets.map((asset: any) => ({
          id: asset.id,
          title: asset.title,
          file: asset.file,
          createdAt: asset.createdAt,
        })),
        ...(assetsRef.current.length ? assetsRef.current : []),
      ]);
    setLocalSyncStatus({
      name: syncStatus.user.name,
      lastUpdate: syncStatus.lastUpdate,
    })
    setSyncState(SyncState.UP_TO_DATE);
  }
}