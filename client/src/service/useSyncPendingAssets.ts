import { PendingLottie } from "../store/types";
import { useUploadAsset } from "./useUploadAsset";
import { useStateSetPendingAssets } from "../store/assets";

export function useSyncPendingAssets () {
  const setPendingAssets = useStateSetPendingAssets();
  const uploadAsset = useUploadAsset();

  async function recursiveUploadPendingAsset(pendingAssets: PendingLottie[]) {
    if (pendingAssets.length === 0) {
      // When there's no more pending assets, consider the local has been updated
      return;
    }
  
    const pendingAsset = pendingAssets[pendingAssets.length - 1];
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
      setPendingAssets(pendingAssets.filter((asset) => asset.id !== pendingAsset.id));
      // Recursive to upload the next one
      recursiveUploadPendingAsset(pendingAssets.slice(0, -1));
    } catch (error) {
      console.error('Failed to upload pending asset', error);
      // TODO: Notify the user
      throw error;
    }
  }

  return (pendingAssets: PendingLottie[]) => recursiveUploadPendingAsset(pendingAssets);
}
