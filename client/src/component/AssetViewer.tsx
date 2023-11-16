import React, { ChangeEvent, useEffect, useMemo } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { clsx } from 'clsx';
import { useStateAssets, useStateSetAssets, useStateCriteria, useStatePendingAssets, useStateSetCriteria, useStateSetViewAsset } from '../store/assets';
import { fetchFileContentFromBucket, getFilePath } from '../service/fileBucket';
import { Criteria, PendingLottie } from '../store/types';
import { Lottie } from '../types';
import { Dropdown } from '../atom/Dropdown';
import { useQuery } from '@apollo/client';
import { GET_ASSETS } from '../repo/graph';
import { client } from '../service/apolloClient';

// NOTE: Separate the pending & asset list component so upon adding a new asset,
// it won't re-render the whole list.

const PendingAssetList = () => {
  const pendingAssets = useStatePendingAssets();
  const setViewAsset = useStateSetViewAsset();
  const onClickDetail = (asset: PendingLottie) => setViewAsset({
    title: asset.title,
    jsonString: asset.jsonString,
  });
  return <>
    {pendingAssets.map(asset => (
    <button
      key={asset.id}
      className="max-w-sm h-60 rounded overflow-hidden shadow-lg border-r-2 border-b-2 bg-gray-100 border-gray-600 hover:border-b-4 hover:h-[calc(15rem-2px)] transition-all"
      onClick={() => onClickDetail(asset)}>
      <Player src={asset.jsonString} className='h-40' />
      <div className="px-6 py-4">
        <div className="text-left text-base mb-2 border-t-2 border-emerald-600 text-gray-600">
          <sup className='text-sm text-red-300'>Offline </sup>
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
  const onClickDetail = async (asset: Lottie) => setViewAsset({
    title: asset.title,
    jsonString: await fetchFileContentFromBucket(asset.file),
  });

  return <>
    {assets.map(asset => (
      <button
        key={asset.id}
        onClick={() => onClickDetail(asset)}
        className="max-w-sm h-60 rounded overflow-hidden shadow-lg border-r-2 border-b-2 border-gray-600 hover:border-b-4 hover:h-[calc(15rem-2px)] transition-all">
        <Player src={getFilePath(asset.file)} className='h-40' />
        <div className="px-6 py-4">
          <div className="text-left text-base mb-2 border-t-2 border-emerald-600">
            {asset.title}
          </div>
        </div>
      </button>
    ))}
  </>
}

const EmptyList = () => {
  const assets = useStateAssets();
  const pendingAssets = useStatePendingAssets();
  const criteria = useStateCriteria();
  const isEmpty = useMemo(() => assets.length === 0 && pendingAssets.length === 0, [assets, pendingAssets]);
  const emptyMessage = useMemo(() => {
    if (!isEmpty) {
      return '';
    }
    if (criteria === Criteria.ALL) {
      return 'Fresh start! Try to upload one!';
    } else {
      return `No assets found on ${criteria}. Try to upload one!`;
    }
  }, [criteria, isEmpty]);
  return <>
    {isEmpty && (
      <div className='text-center text-gray-500 text-xl font-semibold mt-4'>
        {emptyMessage}
      </div>
    )}
  </>
}

const criteriaOption = [
  Criteria.ALL,
  Criteria.GAME,
  Criteria.NATURE,
  Criteria.PEOPLE,
  Criteria.SCIENCE,
  Criteria.SHAPE,
  Criteria.TECH,
]

export const AssetViewer = () => {
  const criteria = useStateCriteria();
  const setCriteria = useStateSetCriteria();
  const setAssets = useStateSetAssets();

  const { data } = useQuery(GET_ASSETS, {
    variables: {
      criteria: criteria === Criteria.ALL ? undefined : criteria,
      after: 0,
    },
    client,
    fetchPolicy: 'network-only', // Always try to retrieve the latest first
  });

  useEffect(() => {
    if (data?.assets) {
      setAssets(data.assets.map((asset: any) => ({
        id: asset.id,
        title: asset.title,
        file: asset.file,
        createdAt: asset.createdAt,
      })));
    } else {
      // TODO: Notify user
    }
  }, [data, setAssets]);

  const onChangeCriteria = async (ev: ChangeEvent) => {
    ev.preventDefault();
    const target = ev.target as HTMLSelectElement;
    const value = target.value as Criteria;
    setCriteria(value);
  }

  return (
    <>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2" htmlFor="grid-state">
            Criteria
          </label>
          <div className="relative mt-2">
            <Dropdown
              value={criteria}
              options={criteriaOption}
              onChange={onChangeCriteria} />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
        <PendingAssetList />
        <AssetList />
        <EmptyList />
      </div>
    </>
  );
}