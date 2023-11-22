import { uploadFileToBucket } from "./fileBucket";
import { Criteria, Lottie, User } from "../store/types";
import { useMutation } from "@apollo/client";
import { CREATE_ASSET } from "../repo/server-graphql/graph";
import { ServiceResult } from "./types";

/**
 * Hook to upload a new asset to the server.
 * @param fallback If true, will save the asset locally if the server is not available.
 */
export function useUploadAsset() {
  const [createAsset] = useMutation(CREATE_ASSET);

  // Service Hooks for the components
  return async (
    file: File,
    criteria: Criteria,
    user: User,
  ): Promise<ServiceResult<Lottie | null>> => {
    // If the user hasn't sync yet, we can't upload the asset as it'll trigger NULL on the user relationship query.
    // Thus, we hold the asset to pending state first.
    if (!user?.isSync) {
      return {
        data: null,
        error: new Error("File Upload: User has not synced yet"),
      };
    }

    try {
      // Upload the file to the server bucket, to retrieve the URL.
      // Once done, we'll use it as the pointer of the asset URL.
      // In case where the user failed to upload, we can fallback to local storage
      // temporarily for user to sync back once they're online again.
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
      return {
        data: result.data
          ? {
              id: result.data.createAsset.id,
              file: result.data.createAsset.file,
              criteria: result.data.createAsset.criteria,
              title: result.data.createAsset.title,
              user: result.data.createAsset.user?.name || "",
              createdAt: result.data.createAsset.createdAt,
            }
          : null,
        error: result.errors,
      };
    } catch (e) {
      return {
        data: null,
        error: e,
      };
    }
  };
}
