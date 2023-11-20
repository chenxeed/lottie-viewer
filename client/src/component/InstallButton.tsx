import clsx from "clsx";
import { Button } from "../atoms/Button";
import { MouseEvent, useEffect, useState } from "react";
import { Modal } from "../atoms/Modal";
import { preloadResources } from "../service/preloadResources";
import { useStateSetNotification } from "../store/notification";

export const InstallButton = () => {
  // Shared state

  const setNotification = useStateSetNotification();

  // Local values

  const [preload, setPreload] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [preloading, setPreloading] = useState(false);
  const [progress, setProgress] = useState([0, 0]);
  const [preloadConfirmed, setPreloadConfirmed] = useState(false);

  // Event Listeners

  // On skip preload, just let the user go and free roam... as long as they got internet
  function onSkipPreload() {
    installApp();
  }

  // On preload, expect those resources to be precached by Service Workers
  function onSubmitPreload() {
    // Upon load, preload certain resources needed for the app to function normally.
    // This is meant for users who are offline right after visit, and have not yet browsed the app further.
    preloadResources({
      onStart: () => {
        setPreloading(true);
      },
      onProgress: (progress, total) => {
        setProgress([progress, total]);
      },
      onDone: () => {
        setPreloading(false);
        setPreloadConfirmed(true);
      },
      onError: (_progress, _total, fail) => {
        setNotification({
          message: `Sorry, ${fail} resources failed to preload`,
          severity: "warning",
        });
      },
    });
  }

  // Once the user has finished the preload, they can finally install the app alongside with the caches preloaded
  function onFinishPreload() {
    setPreloadConfirmed(false);
    setPreload(false);
    installApp();
  }

  function installApp() {
    if (installPrompt) {
      (installPrompt as any).prompt();
      setInstallPrompt(null);
    }
  }

  // Side effects

  useEffect(() => {
    function showInstallButton(event: Event) {
      event.preventDefault();
      setInstallPrompt(event);
    }
    window.addEventListener("beforeinstallprompt", showInstallButton);

    return () => {
      window.removeEventListener("beforeinstallprompt", showInstallButton);
    };
  }, []);

  return (
    <>
      <div
        className={clsx(
          "fixed bottom-4 right-4 z-30 animate-bounce",
          !installPrompt && "hidden",
        )}
      >
        <Button variant="outline-primary" onClick={() => setPreload(true)}>
          Install!
        </Button>
      </div>

      <Modal open={preload}>
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Installing Lottie Viewer
            </h3>
            <div className="mt-2">
              {!preloadConfirmed && (
                <>
                  <h4 className="text-primary">Preload Resource</h4>
                  <p className="text-sm text-gray-500">
                    To ensure maximum experience while you are offline, we would
                    like to predownload the minimum resources necessary to run
                    the app. If not, you may skip the step and proceed to the
                    app while staying online.
                  </p>
                </>
              )}

              {/* Asking User Permission */}

              {!preloading && !preloadConfirmed && (
                <div className="flex justify-evenly items-center mt-4">
                  <Button size="lg" variant="warning" onClick={onSkipPreload}>
                    Skip
                  </Button>
                  <Button
                    size="lg"
                    variant="success"
                    className="animate-bounce"
                    onClick={onSubmitPreload}
                  >
                    Download
                  </Button>
                </div>
              )}

              {/* Show Preload Progress */}

              {preloading && !preloadConfirmed && (
                <div className="mt-4 w-full">
                  <div
                    className="mt-4 bg-gradient-to-r from-yellow-200 to-green-500 h-2.5 rounded-full"
                    style={{
                      width: `${(progress[0] / progress[1]) * 100}%`,
                    }}
                  ></div>
                  <div className="text-center w-full text-sm text-info">
                    {`${progress[0]} / ${progress[1]}`}
                  </div>
                </div>
              )}

              {/* Inform User it has done */}

              {!preloading && preloadConfirmed && (
                <div className="text-center">
                  {/* When user reach this stage, either it's fully preloaded or it was too long, user can still proceed. */}
                  {progress[0] === progress[1] && (
                    <div className="text text-success">
                      Sucessfully Preloaded! You may proceed now
                    </div>
                  )}
                  {progress[0] < progress[1] && (
                    <div className="text text-info">
                      Sorry it takes longer than we thought. Since it has not
                      loaded through all, you may either proceed or refresh the
                      page to try again.
                    </div>
                  )}
                  <Button
                    size="lg"
                    variant="success"
                    onClick={onFinishPreload}
                    className="mt-4"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
