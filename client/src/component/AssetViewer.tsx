import React, { useEffect, useMemo } from 'react';
import { useAssetsStore } from '../store/assets';
import { Lottie } from '../types';
import { PendingLottie } from '../store/types';
import { Player } from '@lottiefiles/react-lottie-player';
import { clsx } from 'clsx';
import { GET_ASSETS } from '../repo/graph';
import { client } from '../apollo-client';

export const AssetViewer = () => {
  const { assets, setAssets, pendingAssets } = useAssetsStore();
  const allAssets = useMemo<(Lottie | PendingLottie)[]>(() => ([...pendingAssets, ...assets]), [assets, pendingAssets]);

  useEffect(() => {
    fetch('/api').then((resp) => resp.json()).then(console.log);

    client.query({
      query: GET_ASSETS,
      fetchPolicy: 'no-cache',
    }).then(({ data }) => {
      const assets = data.assets;
      if (assets) {
        setAssets(assets.map((asset: any) => ({
          id: asset.id,
          title: asset.title,
          file: JSON.parse(asset.file),
          createdAt: asset.createdAt,
        })));  
      }
    });
  }, []);

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