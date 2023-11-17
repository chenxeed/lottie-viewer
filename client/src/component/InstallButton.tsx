import clsx from "clsx";
import { Button } from "../atoms/Button";
import { useEffect, useState } from "react";

export const InstallButton = () => {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);

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

  function onInstallApp() {
    if (installPrompt) {
      (installPrompt as any).prompt();
      setInstallPrompt(null);
    }
  }

  return (
    <div
      className={clsx(
        "fixed bottom-4 right-4 z-30",
        !installPrompt && "hidden",
      )}
    >
      <Button variant="outline-primary" onClick={onInstallApp}>
        Install
      </Button>
    </div>
  );
};
