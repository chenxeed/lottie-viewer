import { CreateUserModal } from "./component/CreateUserModal";
import { AccountDropdown } from "./component/AccountDropdown";
import { CreateAsset } from "./component/CreateAsset";
import { SyncStatus } from "./component/SyncStatus";
import { AssetViewer } from "./component/AssetViewer";
import { AssetDetail } from "./component/AssetDetail";
import { FilterForm } from "./component/FilterForm";
import { NotificationCard } from "./component/NotificationCard";
import { InstallButton } from "./component/InstallButton";
import { useRef } from "react";

function App() {
  const assetsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-gradient-to-b from-emerald-200 to-emerald-600 h-screen shadow-inner">
      <header className="shadow bg-light h-16 sticky top-0 z-30">
        <div className="container mx-auto p-4 h-full flex justify-between">
          <CreateAsset />
          <h2 className="text-xl text-dark drop-shadow text-center">
            Lottie Viewer
          </h2>
          <AccountDropdown />
        </div>
      </header>
      <div
        className="container mx-auto bg-light shadow px-4 pb-4 h-[calc(100vh-4rem)] overflow-y-auto"
        ref={assetsContainerRef}
      >
        <div className="flex justify-between items-start pt-4 pb-2 px-2 shadow-md h-24 bg-light sticky top-0 z-20">
          <FilterForm />
          <SyncStatus />
        </div>
        <AssetViewer scrollDOMRef={assetsContainerRef} />
        <AssetDetail />
      </div>
      <CreateUserModal />
      <NotificationCard />
      <InstallButton />
    </div>
  );
}

export default App;
