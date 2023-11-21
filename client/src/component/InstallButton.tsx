import clsx from "clsx";
import { Button } from "../atoms/Button";
import { useEffect, useState } from "react";
import { PreloadResources } from "./PreloadResources";

export const InstallButton = () => {
  // Local values

  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [openPreload, setOpenPreload] = useState(false);

  // Event Listeners

  function onClickInstall() {
    setOpenPreload(true);
  }

  function onFinishPreload() {
    setOpenPreload(false);
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

  return installPrompt ? (
    <>
      <div className="fixed bottom-4 right-4 z-30 animate-bounce">
        <Button variant="outline-primary" onClick={onClickInstall}>
          Install!
        </Button>
      </div>
      <PreloadResources open={openPreload} onFinishPreload={onFinishPreload} />
    </>
  ) : (
    <></>
  );
};
