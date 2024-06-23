import { readFile } from "../helper/fileReader";
import { useStateAppendPendingAssets } from "../store/assets";
import { Criteria, PendingLottie, User } from "../store/types";
import { ServiceResult } from "./types";

export function useCreatePendingAsset() {
  const appendPendingAssets = useStateAppendPendingAssets();

  return async (
    file: File,
    criteria: Criteria,
    user: User,
  ): Promise<ServiceResult<PendingLottie | null>> => {
    const dataUrl = await readFile(file, "dataURL");
    if (!dataUrl) {
      return {
        data: null,
        error: new Error("CreatePendingAsset: Failed to read file"),
      };
    }

    const newPendingAsset = {
      id: Date.now(), // Random ID since it'll be replaced with the server ID later on sync
      title: file.name,
      dataUrl,
      criteria,
      createdAt: new Date().toISOString(),
      isPending: true,
      user: user?.name || "",
    };

    appendPendingAssets(newPendingAsset);
    return {
      data: newPendingAsset,
      error: null,
    };
  };
}
