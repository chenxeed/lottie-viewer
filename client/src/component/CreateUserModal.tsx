import React, { MouseEvent, useEffect, useMemo, useState } from "react";
import { useStateSetUser, useStateUser } from "../store/user";
import { useSyncUser } from "../service/useSyncUser";
import { Button } from "../atoms/Button";
import arrowDownJSON from "../asset/arrow-down.json";
import fingerSnapJSON from "../asset/fingersnap.json";
import clsx from "clsx";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { Modal } from "../atoms/Modal";
import { useStatePreload, useStateSetPreload } from "../store/preload";
import { preloadResources } from "../service/preloadResources";
import { useStateSetNotification } from "../store/notification";

export const CreateUserModal = () => {
  // Shared state

  const preload = useStatePreload();
  const setPreload = useStateSetPreload();
  const user = useStateUser();
  const setUser = useStateSetUser();
  const syncUser = useSyncUser();
  const setNotification = useStateSetNotification();

  // Local values

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [playerJSON, setPlayerJSON] =
    useState<Record<string, any>>(arrowDownJSON);
  const [preloading, setPreloading] = useState(false);
  const [progress, setProgress] = useState([0, 0]);
  const [preloadConfirmed, setPreloadConfirmed] = useState(false);

  // Computed values

  const open = useMemo(() => {
    return !user;
  }, [user]);

  const userMessage = useMemo(() => {
    if (loading) {
      return "Thank you! Awesomeness is coming...";
    } else {
      return "We are so glad that you here to try out the Lottie Viewer. First, share with us your name to proceed.";
    }
  }, [loading]);

  const canSubmit = useMemo(
    () => !loading && name.trim() !== "" && name.length > 1,
    [loading, name],
  );

  // Side effects

  useEffect(() => {
    if (open) {
      setName("");
      setLoading(false);
      setPlayerJSON(arrowDownJSON);
    }
  }, [open]);

  // Event Listener

  function onChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function onContinue(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);
    setPlayerJSON(fingerSnapJSON);

    setTimeout(() => {
      // Do optimistic sync by saving the user state locally first before sync to the server
      const user = {
        id: Date.now(), // Random ID, to be replaced with real ID once the user is sync
        name: name,
        isSync: false,
      };
      setUser(user);
      syncUser(user);
    }, 2000); // Delay 2s to show the animation
  }

  // On skip preload, just let the user go and free roam... as long as they got internet
  function onSkipPreload(e: MouseEvent) {
    e.preventDefault();
    setPreload(true);
  }

  // On preload, expect those resources to be precached by Service Workers
  function onSubmitPreload(e: MouseEvent) {
    e.preventDefault();
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

  function onFinishPreload() {
    setPreloadConfirmed(false);
    setPreload(true);
  }

  return (
    <Modal open={open}>
      {open && (
        <>
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="h-[300px md:h-[400px]">
              <DotLottiePlayer
                autoplay
                loop
                src={playerJSON}
                className={clsx(
                  "scale-100",
                  loading && "scale-150 duration-[2s]",
                )}
              ></DotLottiePlayer>
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Welcome to Lottie Viewer!
              </h3>
              <div className="mt-2">
                {/* PRELOADING MODE */}

                {!preload && (
                  <>
                    {!preloadConfirmed && (
                      <>
                        <h4 className="text-primary">Preload Resource</h4>
                        <p className="text-sm text-gray-500">
                          To ensure maximum experience while you are offline, we
                          would like to predownload the minimum resources
                          necessary to run the app. Else, you may skip the step
                          and proceed to the app while staying online.
                        </p>
                      </>
                    )}

                    {/* Asking User Permission */}

                    {!preloading && !preloadConfirmed && (
                      <div className="flex justify-evenly items-center mt-2">
                        <Button
                          size="lg"
                          variant="warning"
                          onClick={onSkipPreload}
                        >
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
                      <div
                        className="bg-gradient-to-r from-red-500 to-green-500 h-2.5 rounded-full"
                        style={{
                          width: `${(progress[0] / progress[1]) * 100}%`,
                        }}
                      ></div>
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
                            Sorry it takes longer than we thought. Since it has
                            not loaded through all, you may either proceed or
                            refresh the page to try again.
                          </div>
                        )}
                        <Button
                          size="lg"
                          variant="success"
                          onClick={onFinishPreload}
                          className="mt-2"
                        >
                          Continue
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {/* USER LOGIN MODE */}

                {preload && (
                  <>
                    <p className="text-sm text-gray-500">{userMessage}</p>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="text"
                          name="username"
                          autoComplete="username"
                          maxLength={20}
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Albert Mulia Shintra (20 max char)"
                          onChange={onChangeUsername}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            {preload && (
              <Button
                variant={canSubmit ? "primary" : "dark"}
                size="lg"
                onClick={onContinue}
                disabled={!canSubmit}
              >
                Continue!
              </Button>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};
