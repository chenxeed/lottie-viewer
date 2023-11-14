import React, { useMemo } from 'react';
import { useAssetsStore } from '../store/assets';
import { Lottie } from '../types';
import { PendingLottie } from '../store/types';
import { Player } from '@lottiefiles/react-lottie-player';
import { clsx } from 'clsx';

export const AssetViewer = () => {
  const { assets, pendingAssets } = useAssetsStore();
  const allAssets = useMemo<(Lottie | PendingLottie)[]>(() => ([...pendingAssets, ...assets]), [assets, pendingAssets]);

  return (<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
  {allAssets.map(asset => (
    <button key={asset.id} className="max-w-sm rounded overflow-hidden shadow-lg">
      <Player src={asset.file} />
      <div className="px-6 py-4">
        <div className={clsx('font-bold text-base mb-2', 'isPending' in asset && 'italic text-gray-600')}>
          {asset.title}
        </div>
      </div>
    </button>
  ))}
</div>)
}