import React, { useEffect, useState } from "react";
import { CreateUserModal } from "./component/CreateUserModal";
import { AccountDropdown } from "./component/AccountDropdown";
import { CreateAsset } from "./component/CreateAsset/CreateAsset";
import { useStateUser } from "./store/user";
import { SyncStatus } from "./component/SyncStatus";
import { AssetViewer } from "./component/AssetViewer";
import clsx from "clsx";
import { AssetDetail } from "./component/AssetDetail";
import { FilterForm } from "./component/FilterForm";
import { NotificationCard } from "./component/NotificationCard";
import { Button } from "@mui/material";

function App() {
  const user = useStateUser();
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
    <div className="bg-emerald-100 h-screen shadow-md">
      <header className="shadow flex justify-between bg-slate-100 p-4 h-16 text-xl text-slate-800">
        <div className="flex-grow">
          <h2>Lottie Viewer</h2>
        </div>
        <div className={clsx("mr-4", !installPrompt && "hidden")}>
          <Button variant="contained" onClick={onInstallApp}>
            Install
          </Button>
        </div>
        <AccountDropdown />
      </header>
      <div className="container mx-auto bg-slate-50 shadow px-4 pb-4 mt-2 h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="flex justify-between pt-4 pb-2 border-b-2 border-emerald-200 sticky top-0 bg-slate-50 z-10">
          <CreateAsset />
          <FilterForm />
          <SyncStatus />
        </div>
        <AssetViewer />
        <AssetDetail />
      </div>
      {!user && <CreateUserModal />}
      <NotificationCard />
    </div>
  );
}

export default App;
