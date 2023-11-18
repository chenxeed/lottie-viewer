import { StateAction, LottieStorage, Criteria } from "./types";
import { useStore } from ".";

// Initiate the assets state with the assets from localStorage
const initialPendingAsset = localStorage.getItem(LottieStorage.PENDING_ASSETS);
useStore.setState((state) => ({
  ...state,
  assets: [],
  pendingAssets: initialPendingAsset ? JSON.parse(initialPendingAsset) : [],
}));

useStore.subscribe((state) => {
  if (state.action === StateAction.SET_PENDING_ASSETS) {
    localStorage.setItem(
      LottieStorage.PENDING_ASSETS,
      JSON.stringify(state.pendingAssets),
    );
  }
});

export const useStateAssets = () => useStore((state) => state.assets);
export const useStateSetAssets = () => useStore((state) => state.setAssets);
export const useStatePendingAssets = () =>
  useStore((state) => state.pendingAssets);
export const useStatePendingAssetsByCriteria = () =>
  useStore((state) =>
    state.pendingAssets.filter(
      ({ criteria }) =>
        state.criteria === Criteria.ALL || state.criteria === criteria,
    ),
  );
export const useStateSetPendingAssets = () =>
  useStore((state) => state.setPendingAssets);
export const useStateViewAsset = () => useStore((state) => state.viewAsset);
export const useStateSetViewAsset = () =>
  useStore((state) => state.setViewAsset);
export const useStateCriteria = () => useStore((state) => state.criteria);
export const useStateSetCriteria = () => useStore((state) => state.setCriteria);
