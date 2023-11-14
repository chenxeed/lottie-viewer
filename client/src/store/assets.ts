import { StateAction, LottieStorage } from './types';
import { useStore  } from '.';

// Initiate the assets state with the assets from localStorage
const initialPendingAsset = localStorage.getItem(LottieStorage.PENDING_ASSETS);
useStore.setState((state) => ({
  ...state,
  assets: [],
  pendingAssets: initialPendingAsset ? JSON.parse(initialPendingAsset) : [],
}));

useStore.subscribe((state) => {
  if (state.action === StateAction.SET_PENDING_ASSETS) {
    localStorage.setItem(LottieStorage.PENDING_ASSETS, JSON.stringify(state.pendingAssets));
  }
});

export const useAssetsStore = () => {
  const assets = useStore((state) => state.assets);
  const setAssets = useStore((state) => state.setAssets);

  const pendingAssets = useStore((state) => state.pendingAssets);
  const setPendingAssets = useStore((state) => state.setPendingAssets);

  return {
    assets,
    setAssets,
    pendingAssets,
    setPendingAssets,
  }
}
