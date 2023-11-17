import { useStateLocalSyncStatus } from "../store/syncStatus";
import { useCallback, useMemo, useState } from "react";
import { formatRelative, parseISO } from "date-fns";
import { useSyncPendingAssets } from "../service/useSyncPendingAssets";
import { useSyncUser } from "../service/useSyncUser";
import { useSyncAssets } from "../service/useSyncAssets";
import { useStateSyncState } from "../store/syncStatus";
import { SyncState } from "../store/types";
import { Button } from "@mui/material";
import { useStateSetNotification } from "../store/notification";
import { ellipsisText } from "../helper/eliipsisText";

export const SyncStatus = () => {
  const setNotification = useStateSetNotification();

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

  const lastSyncMessage = useMemo(() => {
    if (syncState === SyncState.SYNCING) {
      return <span className="text-blue-500">Synching... Please wait</span>;
    } else if (syncState === SyncState.UP_TO_DATE) {
      return (
        <>
          <span className="text-green-500">{`Last Update ${formatRelative(
            parseISO(localSyncStatus.lastUpdate),
            new Date(),
          )}`}</span>
          <br />
          <span className="text-green-500">{`by ${ellipsisText(
            localSyncStatus.name,
            10,
          )}`}</span>
        </>
      );
    } else if (syncState === SyncState.NO_SYNC) {
      return <span className="text-gray-500">No update yet.</span>;
    } else if (syncState === SyncState.FAIL_TO_SYNC) {
      return (
        <span className="text-red-500">Fail to sync. Please try again.</span>
      );
    } else {
      return <span className="text-yellow-500">Unknown status</span>;
    }
  }, [syncState, localSyncStatus]);

  return (
    <div className="text-right w-36 md:w-52 min-h-[76px] grid grid-rows-2 gap-2">
      <div className="text-xs md:text-sm italic">{lastSyncMessage}</div>
      <Button
        variant="outlined"
        onClick={handleSynchronize}
        disabled={isLoading}
      >
        {isLoading ? "..." : "Sync"}
      </Button>
    </div>
  );
};
