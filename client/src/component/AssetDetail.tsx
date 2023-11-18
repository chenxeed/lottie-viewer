import { useEffect, useRef, useState } from "react";
import { useStateSetViewAsset, useStateViewAsset } from "../store/assets";
import {
  DotLottiePlayer,
  Controls,
  DotLottieCommonPlayer,
  PlayerEvents,
} from "@dotlottie/react-player";
import JsonView from "@uiw/react-json-view";
import { Modal } from "../atoms/Modal";

export const AssetDetail = () => {
  // Shared state

  const viewAsset = useStateViewAsset();
  const setViewAsset = useStateSetViewAsset();

  // Local state

  const [open, setOpen] = useState(false);
  const dotLottieRef = useRef<DotLottieCommonPlayer | null>(null);
  const [jsonObj, setJsonObj] = useState<Record<string, any>[]>([]);

  // Event Listeners

  // For dotlottie files, we rely on the Player instance to get the Animation JSON object
  function onLottiePlayerEvent(event: PlayerEvents) {
    if (event === "ready" && dotLottieRef.current?.animations.size) {
      const jsonMap = dotLottieRef.current?.animations;
      if (jsonMap) {
        setJsonObj([...jsonMap.values()]);
      }
    }
  }

  function onClose() {
    setViewAsset(null);
    setOpen(false);
  }

  // Side Effects

  useEffect(() => {
    if (viewAsset) {
      setOpen(true);
    }
  }, [viewAsset]);

  return (
    <Modal open={open} onClose={onClose}>
      {open && viewAsset ? (
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <div className="flex items-center border-b-2 border-emerald-300 pb-2">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {viewAsset.title}
              </h3>
              <a
                href={viewAsset.fileUrl}
                download={viewAsset.title}
                className="ml-4 bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center shadow"
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span className="ml-2 hidden sm:inline">Download</span>
              </a>
            </div>

            <div className="lg:flex">
              <div className="mt-2 w-full h-80">
                {/* DotLottie Player for Animation Preview  */}

                {viewAsset.fileUrl && (
                  <DotLottiePlayer
                    ref={dotLottieRef}
                    autoplay
                    loop
                    src={viewAsset.fileUrl}
                    onEvent={onLottiePlayerEvent}
                  >
                    <Controls />
                  </DotLottiePlayer>
                )}
              </div>
              <div className="mt-2 w-full min-h-[150px] max-h-48 lg:max-h-96 text-left overflow-auto">
                {/* JSON Viewer for Metadata Preview */}

                {jsonObj.length > 0 &&
                  jsonObj.map((obj, idx) => (
                    <JsonView
                      value={obj}
                      keyName="Animations"
                      collapsed={jsonObj.length > 1 ? 0 : 1}
                      displayDataTypes={false}
                      enableClipboard={false}
                      key={idx}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        open && (
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Oops, something went wrong. Please close and try again
                </h3>
              </div>
            </div>
          </div>
        )
      )}
    </Modal>
  );
};
