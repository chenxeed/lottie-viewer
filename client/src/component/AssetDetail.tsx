import React, { useMemo, useRef, useState } from 'react';
import { useStateSetViewAsset, useStateViewAsset } from '../store/assets';
import clsx from 'clsx';
import { Player, Controls, PlayerEvent } from '@lottiefiles/react-lottie-player';
import { JsonViewer } from '@textea/json-viewer';
import { downloadObjectAsJson } from '../helper/fileDownload';

const KeyRenderer = ({ path }: any) => {
  return <div className='bg-slate-700 text-slate-200'>&quot;{path.slice(-1)}&quot;</div>;
};
KeyRenderer.when = (props: any) => {
  return props.value === 120;
};

export const AssetDetail = () => {

  const viewAsset = useStateViewAsset();
  const setViewAsset = useStateSetViewAsset();
  const [frame, setFrame] = useState(0);
  const controls = useRef<Controls>(null);
  const jsonObj = useMemo(() => viewAsset ? JSON.parse(viewAsset?.jsonString) : {}, [viewAsset]);

  function onClose () {
    setViewAsset(null);
  }

  function onPlayerEvent (e: PlayerEvent) {
    setFrame(Math.round(controls.current?.props.instance.currentFrame));
  }

  function downloadJson () {
    if (!viewAsset) {
      return
    }
    downloadObjectAsJson(viewAsset.jsonString, viewAsset.title)
  }

  return (
    <div
      className={clsx('fixed z-10 inset-0 overflow-hidden', viewAsset ? 'opacity-100 transition-all translate-y-0' : 'h-0 w-0 opacity-0 -translate-y-60')}
      aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className='absolute inset-0 overflow-hidden w-full h-full bg-slate-600 opacity-50' />
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-4xl">
              <div className="absolute top-2 right-2">
                <button type="button" className="inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={onClose}>
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>                  
                </button>
              </div>
              {viewAsset ? (
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <div className="flex items-center border-b-2 border-emerald-300 pb-2">
                      <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">{ viewAsset.title }</h3>
                      <button onClick={downloadJson} className="ml-4 bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center shadow">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                        <span className='ml-2 hidden sm:inline'>Download</span>
                      </button>
                    </div>
                    <div className='lg:flex'>
                      <div className="mt-2 w-full">
                        <Player style={{ height: 320 }} autoplay loop src={viewAsset.jsonString} onEvent={onPlayerEvent}>
                          <Controls ref={controls} visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
                        </Player>
                      </div>
                      <div className='mt-2 w-full min-h-[150px] max-h-48 lg:max-h-96 text-left overflow-auto'>
                        <JsonViewer
                          value={jsonObj}
                          displayDataTypes={false}
                          rootName={'Animation'}
                          defaultInspectDepth={1}
                        />
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