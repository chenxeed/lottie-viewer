import React, { useEffect, useMemo, useState } from "react";
import { useStateSetUser, useStateUser } from "../store/user";
import { useSyncUser } from "../service/useSyncUser";
import { Button } from "../atoms/Button";
import arrowDownJSON from "../asset/arrow-down.json";
import fingerSnapJSON from "../asset/fingersnap.json";
import clsx from "clsx";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { Modal } from "../atoms/Modal";

export const CreateUserModal = () => {
  // Shared state

  const user = useStateUser();
  const setUser = useStateSetUser();
  const syncUser = useSyncUser();

  // Local values

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldSync, setShouldSync] = useState(false);
  const [playerJSON, setPlayerJSON] =
    useState<Record<string, any>>(arrowDownJSON);

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

  // Sync the user to the server, once the user has set locally
  useEffect(() => {
    if (user && shouldSync) {
      syncUser();
    }
  }, [user, shouldSync, syncUser]);

  // Event Listener

  function onChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function onContinue() {
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
      setShouldSync(true);
    }, 2000); // Delay 2s to show the animation
  }

  return (
    <Modal open={open}>
      {open && (
        <form>
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
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  className="text-base font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  Welcome!
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{userMessage}</p>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Albert Mulia Shintra"
                        onChange={onChangeUsername}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              variant={canSubmit ? "primary" : "dark"}
              size="lg"
              onClick={onContinue}
              disabled={!canSubmit}
            >
              Continue!
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
