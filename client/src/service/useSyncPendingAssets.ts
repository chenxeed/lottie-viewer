import { LottieStorage, PendingLottie } from "../store/types";
import { useUploadAsset } from "./useUploadAsset";
import { useStateSetPendingAssets } from "../store/assets";
import { useCallback } from "react";
import { useStateSetNotification } from "../store/notification";
import { dataURLtoBlob } from "./fileBucket";

export function useSyncPendingAssets() {
  const setPendingAssets = useStateSetPendingAssets();
  const uploadAsset = useUploadAsset();
  const setNotification = useStateSetNotification();

  return useCallback(() => {
    async function recursiveUploadPendingAsset(
      nextPendingAssets: PendingLottie[],
    ) {
      if (nextPendingAssets.length === 0) {
        // When there's no more pending assets, consider the local has been updated
        return;
      }

      const pendingAsset = nextPendingAssets[nextPendingAssets.length - 1];
      // Upload the pending asset
      // If success, remove the asset from pendingAssets
      // If fail, do nothing
      const mimeType = pendingAsset.title.endsWith(".json")
        ? "application/json"
        : "";
      const file = new File(
        [await dataURLtoBlob(pendingAsset.dataUrl)],
        pendingAsset.title,
        {
          type: mimeType,
        },
      );
      const result = await uploadAsset(file, pendingAsset.criteria);
      if (!result) {
        throw new Error("Failed to upload pending asset");
      }
      if (result.errors) {
        throw result.errors;
      }
      setPendingAssets(
        nextPendingAssets.filter((asset) => asset.id !== pendingAsset.id),
      );
      // Recursive to upload the next one
      await recursiveUploadPendingAsset(nextPendingAssets.slice(0, -1));
    }

    // To sync the pending assets, we have to ensure it's by the current local storage data.
    // Thus, we have to get the latest pending assets from the local storage instead of the state.
    // This prevent duplicate pending assets when the user tries to sync from multiple tabs in the same browser.
    // If there's no more pending assets, consider the local has been sync and we can clear the pending assets.

    const latestPendingAssetsRaw = localStorage.getItem(
      LottieStorage.PENDING_ASSETS,
    );
    if (!latestPendingAssetsRaw) {
      setPendingAssets([]);
      return Promise.resolve();
    }
    const latestPendingAssets: PendingLottie[] = JSON.parse(
      latestPendingAssetsRaw,
    );
    setPendingAssets(latestPendingAssets);
    try {
      return recursiveUploadPendingAsset(latestPendingAssets);
    } catch (error) {
      console.error("syncPendingAssets: Failed to upload pending asset", error);
      setNotification({
        severity: "error",
        message: "Failed to upload pending asset",
      });
      throw error;
    }
  }, [setNotification, setPendingAssets, uploadAsset]);
}
