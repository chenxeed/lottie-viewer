import { LottieStorage, PendingLottie } from "../store/types";
import { useUploadAsset } from "./useUploadAsset";
import { useStateSetPendingAssets } from "../store/assets";
import { useCallback } from "react";

export function useSyncPendingAssets () {

  const setPendingAssets = useStateSetPendingAssets();
  const uploadAsset = useUploadAsset();

  return useCallback(() => {
    async function recursiveUploadPendingAsset(nextPendingAssets: PendingLottie[]) {
      if (nextPendingAssets.length === 0) {
        // When there's no more pending assets, consider the local has been updated
        return;
      }
    
      const pendingAsset = nextPendingAssets[nextPendingAssets.length - 1];
      // Upload the pending asset
      // If success, remove the asset from pendingAssets
      // If fail, do nothing
      try {
        const file = new File([pendingAsset.jsonString], pendingAsset.title, { type: 'application/json' });
        const result = await uploadAsset(file, pendingAsset.criteria);
        if (!result) {
          throw new Error('Failed to upload pending asset');
        }
        if (result.errors) {
          throw result.errors;
        }
        setPendingAssets(nextPendingAssets.filter((asset) => asset.id !== pendingAsset.id));
        // Recursive to upload the next one
        recursiveUploadPendingAsset(nextPendingAssets.slice(0, -1));
      } catch (error) {
        console.error('Failed to upload pending asset', error);
        // TODO: Notify the user
        throw error;
      }
    }
  
    // To sync the pending assets, we have to ensure it's by the current local storage data.
    // Thus, we have to get the latest pending assets from the local storage instead of the state.
    // This prevent duplicate pending assets when the user tries to sync from multiple tabs in the same browser.
    // If there's no more pending assets, consider the local has been sync and we can clear the pending assets.

    const latestPendingAssetsRaw = localStorage.getItem(LottieStorage.PENDING_ASSETS);
    if (!latestPendingAssetsRaw) {
      setPendingAssets([]);
      return Promise.resolve();
    }
    const latestPendingAssets: PendingLottie[] = JSON.parse(latestPendingAssetsRaw);
    setPendingAssets(latestPendingAssets);
    return recursiveUploadPendingAsset(latestPendingAssets);
  }, [setPendingAssets, uploadAsset]);
}
