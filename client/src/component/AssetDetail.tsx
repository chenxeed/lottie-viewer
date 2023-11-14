import React from 'react';
import { useStateSetViewAsset, useStateViewAsset } from '../store/assets';
import clsx from 'clsx';
import { Player, Controls, PlayerEvent } from '@lottiefiles/react-lottie-player';

export const AssetDetail = () => {

  const viewAsset = useStateViewAsset();
  const setViewAsset = useStateSetViewAsset();

  function onClose () {
    setViewAsset(null);
  }

  function onPlayerEvent (e: PlayerEvent) {
    console.log(e);
  }

  return (
    <div
      className={clsx('fixed z-10 inset-0 overflow-hidden', viewAsset ? 'opacity-100 transition-all translate-y-0' : 'h-0 w-0 opacity-0 -translate-y-60')}
      aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className='absolute inset-0 overflow-hidden w-full h-full bg-slate-600 opacity-50' />
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="absolute top-2 right-2">
                <button type="button" className="inline-flex justify-center rounded-md bg-stroke-n-600 px-3 py-2 text-sm font-semibold text-blue-400 shadow-sm hover:bg-stroke-linen-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={onClose}>
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>                  
                </button>
              </div>
              {viewAsset ? (
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">{ viewAsset.title }</h3>
                      <div className="mt-2">
                        <Player autoplay loop src={viewAsset.file} onEvent={onPlayerEvent}>
                          <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
                        </Player>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Oops, something went wrong. Please close and try again</h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}