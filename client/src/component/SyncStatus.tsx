import { useStateLocalSyncStatus } from "../store/syncStatus";
import { useCallback, useMemo, useState } from "react";
import { formatRelative, parseISO } from "date-fns";
import { useSyncPendingAssets } from "../service/useSyncPendingAssets";
import { useSyncUser } from "../service/useSyncUser";
import { useSyncAssets } from "../service/useSyncAssets";
import { useStateSyncState } from "../store/syncStatus";
import { SyncState } from "../store/types";
import { useStateSetNotification } from "../store/notification";
import { ellipsisText } from "../helper/ellipsisText";
import { Button } from "../atoms/Button";

export const SyncStatus = () => {
  // Shared state

  const localSyncStatus = useStateLocalSyncStatus();
  const syncState = useStateSyncState();
  const setNotification = useStateSetNotification();

  //Local values

  const [isLoading, setIsLoading] = useState(false);

  // Computed values

  const lastSyncMessage = useMemo(() => {
    switch (syncState) {
      case SyncState.SYNCING:
        return <span className="text-primary">Synching... Please wait</span>;
      case SyncState.UP_TO_DATE:
        return (
          <>
            <span className="text-success">{`Last Update ${formatRelative(
              parseISO(localSyncStatus.lastUpdate),
              new Date(),
            )}`}</span>
            <span className="text-success">{` by ${ellipsisText(
              localSyncStatus.name,
              10,
            )}`}</span>
          </>
        );
      case SyncState.NO_SYNC:
        return <span className="text-secondary">No update yet.</span>;
      case SyncState.FAIL_TO_SYNC:
        return (
          <span className="text-danger">
            Fail to sync. Check your internet connection.
          </span>
        );
      case SyncState.NEED_UPDATE:
        return (
          <span className="text-warning">
            Incomplete Update. Please sync again.
          </span>
        );
      default:
        return <span className="text-warning">Unknown status</span>;
    }
  }, [syncState, localSyncStatus]);

  // Service hooks

  const syncUser = useSyncUser();
  const syncPendingAssets = useSyncPendingAssets();
  const syncAssets = useSyncAssets();

  // Event Listeners

  /**
   * Synchronize the user's local data with the latest data on the server.
   *
   * It has 3 steps:
   * 1. Sync the user state, in case the user was created during offline mode
   * 2. Sync the pending assets, in case the user created assets during offline mode
   * 3. Sync the latest assets from the server, by checking the last sync status.
   * To ensure efficiency, we use the last asset ID as the cursor, so it will only return the latest assets since the last asset synchronized
   *  */
  const handleSynchronize = useCallback(async () => {
    setIsLoading(true);
    try {
      // Sync the user state, in case the user was created during offline mode
      const { data: authUser } = await syncUser();

      // Sync the pending assets, in case the user has created assets during offline mode
      if (authUser.isSync) {
        const result = await syncPendingAssets(authUser);
        if (result.error) {
          throw result.error;
        }
      }

      // Sync the latest assets from the server, by checking the last sync status
      const result = await syncAssets();
      if (result.error) {
        throw result.error;
      }
    } catch (e) {
      setNotification({
        severity: "warning",
        message: "Fail to synchronize. Please ensure you are online.",
        errorString: `${e}`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [setNotification, syncAssets, syncPendingAssets, syncUser]);

  return (
    <div className="text-right w-52 md:w-60 min-h-[70px] flex flex-col justify-between items-end">
      <div className="text-[10px] md:text-sm italic truncate">
        {lastSyncMessage}
      </div>
      <Button
        variant="warning"
        size="sm"
        onClick={handleSynchronize}
        disabled={isLoading}
      >
        {isLoading ? "..." : "Sync"}
      </Button>
    </div>
  );
};
