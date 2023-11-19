import { useLazyQuery } from "@apollo/client";
import { GET_ASSETS, GET_LAST_SYNC_STATUS } from "../repo/server-graphql/graph";
import {
  useStateLocalSyncStatus,
  useStateSetLocalSyncStatus,
  useStateSetSyncState,
} from "../store/syncStatus";
import { Criteria, SyncState } from "../store/types";
import {
  useStateAssets,
  useStateCriteria,
  useStateSetAssets,
} from "../store/assets";
import { useRef } from "react";
import { client } from "../repo/server-graphql/client";

/**
 * Service to synchronize local assets with the server.
 *
 * It follows the Cursor Pagination strategy, where the client will
 * request the newer assets from the currently loaded assets.
 */
export function useSyncAssets() {
  // Shared states

  const localSyncStatus = useStateLocalSyncStatus();
  const localSyncStatusRef = useRef(localSyncStatus);
  localSyncStatusRef.current = localSyncStatus;
  const setLocalSyncStatus = useStateSetLocalSyncStatus();
  const [getSyncStatus] = useLazyQuery(GET_LAST_SYNC_STATUS, {
    client,
    fetchPolicy: "no-cache",
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
    // Prevent cache to ensure the sync with latest data on server.
    // If the user is offline, expect the sync to fail and notify the user that they're not sync yet
    fetchPolicy: "no-cache",
  });

  // Service Hooks for the components
  // Here's the process:
  // 1. Check the local status if it's updated or outdated. If updated, do nothing
  // 2. If outdated, use the last asset's ID as the cursor to get the newer list.
  // 3. To limit the response load, we only request 20 items at a time.

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
      // This could be the very first time when there's no one upload any assets yet, thus back to original state
      setSyncState(SyncState.NO_SYNC);
      return;
    }

    if (syncStatus.lastUpdate === localSyncStatusRef.current.lastUpdate) {
      // User has already sync with the latest data
      setSyncState(SyncState.UP_TO_DATE);
      return;
    }

    // At this point, user has outdated assets, so we need to sync with the server.

    const assetsResult = await getAssets({
      variables: {
        criteria:
          criteriaRef.current === Criteria.ALL
            ? undefined
            : criteriaRef.current,
        after: assetsRef.current.length ? assetsRef.current[0].id : 0,
        limit: 20,
      },
    });
    if (!assetsResult.data) {
      // Fail to get the assets, user might be offline
      setSyncState(SyncState.FAIL_TO_SYNC);
      return;
    }
    // At this point, user has updated their data with the server
    // Reverse the order because we retrieve it from the eldest to newest,
    // while our `assets` are ordered from newest to eldest.

    const latestAssets = assetsResult.data.assets.nodes
      .reverse()
      .filter(
        (asset) =>
          criteriaRef.current === Criteria.ALL ||
          asset.criteria === criteriaRef.current,
      );
    setAssets([
      ...latestAssets.map((asset) => ({
        id: asset.id,
        title: asset.title,
        file: asset.file,
        criteria: asset.criteria as Criteria,
        createdAt: asset.createdAt,
        user: asset.user?.name || "",
      })),
      ...(assetsRef.current.length ? assetsRef.current : []),
    ]);

    // If there's still more data to sync, let the user to sync again manually.
    // Reason is to prevent the user to sync too much data at once.

    if (assetsResult.data.assets.pageInfo.hasNextPage) {
      setLocalSyncStatus({
        name: syncStatus.user.name,
        lastUpdate: latestAssets[0].createdAt,
      });
      setSyncState(SyncState.NEED_UPDATE);
    } else {
      setLocalSyncStatus({
        name: syncStatus.user.name,
        lastUpdate: syncStatus.lastUpdate,
      });
      setSyncState(SyncState.UP_TO_DATE);
    }
  };
}
