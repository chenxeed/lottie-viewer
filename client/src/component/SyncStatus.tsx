import { useStateLocalSyncStatus } from "../store/syncStatus";
import { useCallback, useMemo, useState } from "react";
import { formatRelative, parseISO } from "date-fns";
import { useSyncPendingAssets } from "../service/useSyncPendingAssets";
import { useSyncUser } from "../service/useSyncUser";
import { useSyncAssets } from "../service/useSyncAssets";
import { useStateSyncState } from "../store/syncStatus";
import { SyncState } from "../store/types";
import { useStateSetNotification } from "../store/notification";
import { ellipsisText } from "../helper/eliipsisText";
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
        return <span className="text-blue-500">Synching... Please wait</span>;
      case SyncState.UP_TO_DATE:
        return (
          <>
            <span className="text-green-500">{`Last Update ${formatRelative(
              parseISO(localSyncStatus.lastUpdate),
              new Date(),
            )}`}</span>
            <span className="text-green-500">{` by ${ellipsisText(
              localSyncStatus.name,
              10,
            )}`}</span>
          </>
        );
      case SyncState.NO_SYNC:
        return <span className="text-gray-500">No update yet.</span>;
      case SyncState.FAIL_TO_SYNC:
        return (
          <span className="text-red-500">Fail to sync. Please try again.</span>
        );
      default:
        return <span className="text-yellow-500">Unknown status</span>;
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
      await syncUser();

      // Sync the pending assets, in case the user created assets during offline mode
      await syncPendingAssets();

      // Sync the latest assets from the server, by checking the last sync status
      await syncAssets();
    } catch (e) {
      setNotification({
        severity: "error",
        message: "Fail to synchronize. Please try again.",
      });
      console.error("Fail to synchronize", e);
    } finally {
      setIsLoading(false);
    }
  }, [setNotification, syncAssets, syncPendingAssets, syncUser]);

  return (
    <div className="text-right w-36 md:w-52 min-h-[76px] flex flex-col justify-between items-end">
      <div className="text-xs md:text-sm italic">{lastSyncMessage}</div>
      <Button
        variant="warning"
        onClick={handleSynchronize}
        disabled={isLoading}
      >
        {isLoading ? "..." : "Sync"}
      </Button>
    </div>
  );
};
