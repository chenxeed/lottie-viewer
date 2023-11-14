import React, { useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { clsx } from 'clsx';
import { useStateAssets, useStatePendingAssets } from '../store/assets';
import { useLoadAssets } from '../service/useLoadAssets';

export const AssetViewer = () => {
  const pendingAssets = useStatePendingAssets();
  const assets = useStateAssets();
  const loadAssets = useLoadAssets();

  useEffect(() => {
    loadAssets();
  }, []);

  return (<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
  {pendingAssets.map(asset => (
    <button key={asset.id} className="max-w-sm rounded overflow-hidden shadow-lg">
      <Player src={asset.file} />
      <div className="px-6 py-4">
        <div className={clsx('font-bold text-base mb-2 italic text-gray-600')}>
          {asset.title}
        </div>
      </div>
    </button>
  ))}
  {assets.map(asset => (
    <button key={asset.id} className="max-w-sm rounded overflow-hidden shadow-lg">
      <Player src={asset.file} />
      <div className="px-6 py-4">
        <div className="font-bold text-base mb-2">
          {asset.title}
        </div>
      </div>
    </button>
  ))}
</div>)
}