import React, { useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { clsx } from 'clsx';
import { useStateAssets, useStatePendingAssets, useStateSetViewAsset } from '../store/assets';
import { useLoadAssets } from '../service/useLoadAssets';

// NOTE: Separate the pending & asset list component so upon adding a new asset,
// it won't re-render the whole list.

const PendingAssetList = () => {
  const pendingAssets = useStatePendingAssets();
  return <>
    {pendingAssets.map(asset => (
    <button key={asset.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-slate-300">
      <Player src={asset.file} className='h-40' />
      <div className="px-6 py-4">
        <div className={clsx('font-bold text-base mb-2 italic text-gray-600')}>
          {asset.title}
        </div>
      </div>
    </button>
  ))}
  </>
}

const AssetList = () => {
  const assets = useStateAssets();
  const setViewAsset = useStateSetViewAsset();

  return <>
    {assets.map(asset => (
      <button
        key={asset.id}
        className="max-w-sm h-60 rounded overflow-hidden shadow-lg border-r-2 border-b-2 border-gray-600 hover:border-b-4 hover:h-[calc(15rem-2px)] transition-all"
        onClick={() => setViewAsset(asset)}>
        <Player src={asset.file} className='h-40' />
        <div className="px-6 py-4">
          <div className="text-left text-base mb-2 border-t-2 border-emerald-600">
            {asset.title}
          </div>
        </div>
      </button>
    ))}
  </>
}

export const AssetViewer = () => {
  const loadAssets = useLoadAssets();

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
      <PendingAssetList />
      <AssetList />
    </div>
  );
}