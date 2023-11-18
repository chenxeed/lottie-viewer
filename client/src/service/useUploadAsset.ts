import { CREATE_ASSET } from "../repo/server-graphql/graph";
import { client } from "../repo/server-graphql/client";
import { useMutation } from "@apollo/client";
import { useStateUser } from "../store/user";
import {
  useStatePendingAssets,
  useStateSetPendingAssets,
} from "../store/assets";
import { uploadFileToBucket } from "./fileBucket";
import { readFile } from "../helper/fileReader";
import { Criteria } from "../store/types";
import { useStateSetNotification } from "../store/notification";

interface UploadAssetOption {
  /**
   * If true, will save the asset locally if the server is not available.
   */
  fallback: boolean;
}

/**
 * Hook to upload a new asset to the server.
 * @param fallback If true, will save the asset locally if the server is not available.
 */
export function useUploadAsset(option?: UploadAssetOption) {
  const { fallback = false } = option || {};

  // Shared state

  const user = useStateUser();

  const setNotification = useStateSetNotification();

  const pendingAssets = useStatePendingAssets();

  const setPendingAssets = useStateSetPendingAssets();
  const [createAsset] = useMutation(CREATE_ASSET, { client });

  // Service Hooks for the components
  return async (file: File, criteria: Criteria) => {
    /**
     * Function to save the selected assets to the local storage, in case the server is not available or user is not eligible.
     */
    async function fallbackPendingAsset(file: File, criteria: Criteria) {
      const dataUrl = await readFile(file, "dataURL");
      if (!dataUrl) {
        setNotification({
          severity: "error",
          message:
            "Failed to save your file offline. Please check if it is a valid file.",
        });
        throw new Error("Failed to save the file offline");
      }
      setPendingAssets([
        {
          id: Date.now(), // Random ID since it'll be replaced with the server ID later on sync
          title: file.name,
          dataUrl,
          criteria,
          createdAt: new Date().toISOString(),
          isPending: true,
        },
        ...pendingAssets,
      ]);
      setNotification({
        severity: "info",
        message:
          "Your animation has uploaded into your device. Once you're online, press SYNC to synchronize to the server.",
      });
    }

    // If the user hasn't sync yet, we can't upload the asset as it'll trigger NULL on the user relationship query.
    // Thus, we hold the asset to pending state first.
    if (!user?.isSync) {
      return fallbackPendingAsset(file, criteria);
    }

    // Upload the file to the server bucket, to retrieve the URL.
    // Once done, we'll use it as the pointer of the asset URL.
    // In case where the user failed to upload, we can fallback to local storage
    // temporarily for user to sync back once they're online again.
    try {
      const uploadedFile = await uploadFileToBucket(file);
      const { filename, originalname } = uploadedFile;

      const result = await createAsset({
        variables: {
          userId: user?.id,
          title: originalname,
          file: filename,
          criteria,
        },
      });
      if (!result.data) {
        throw new Error("Failed to create asset");
      }
      return result;
    } catch (e) {
      if (fallback) {
        await fallbackPendingAsset(file, criteria);
      } else {
        throw e;
      }
    }
  };
}
