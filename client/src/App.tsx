import { CreateUserModal } from "./component/CreateUserModal";
import { AccountDropdown } from "./component/AccountDropdown";
import { CreateAsset } from "./component/CreateAsset";
import { SyncStatus } from "./component/SyncStatus";
import { AssetViewer } from "./component/AssetViewer";
import { AssetDetail } from "./component/AssetDetail";
import { FilterForm } from "./component/FilterForm";
import { NotificationCard } from "./component/NotificationCard";
import { InstallButton } from "./component/InstallButton";

function App() {
  return (
    <div className="bg-emerald-100 h-screen shadow-inner">
      <header className="shadow bg-slate-100 h-20">
        <div className="container mx-auto p-4 h-full flex justify-between">
          <CreateAsset />
          <h2 className="text-xl text-slate-800 drop-shadow text-center">
            Lottie Viewer
          </h2>
          <AccountDropdown />
        </div>
      </header>
      <div className="container mx-auto bg-slate-50 shadow px-4 pb-4 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex justify-between items-start pt-4 pb-2 border-b-2 border-emerald-200 bg-slate-50 sticky top-0 z-10">
          <FilterForm />
          <SyncStatus />
        </div>
        <AssetViewer />
        <AssetDetail />
      </div>
      <CreateUserModal />
      <NotificationCard />
      <InstallButton />
    </div>
  );
}

export default App;
