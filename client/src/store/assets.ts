import { StateAction, LottieStorage } from './types';
import { useStore  } from '.';

// Initiate the assets state with the assets from localStorage
const initialAsset = localStorage.getItem(LottieStorage.ASSETS);
useStore.setState((state) => ({
  ...state,
  assets: initialAsset ? JSON.parse(initialAsset) : [],
}));

useStore.subscribe((state) => {
  if (state.action === StateAction.SET_ASSETS) {
    localStorage.setItem(LottieStorage.ASSETS, JSON.stringify(state.assets));
  }
});

export const useAssetsStore = () => {
  const assets = useStore((state) => state.assets);
  const setAssets = useStore((state) => state.setAssets);

  return {
    assets,
    setAssets
  }
}
