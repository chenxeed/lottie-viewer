import React from 'react';
import { CreateUserModal } from './component/CreateUserModal';
import { AccountDropdown } from './component/AccountDropdown';
import { CreateAsset } from './component/CreateAsset';
import { useUserStore } from './store/user';
import { SyncStatus } from './component/SyncStatus';
import { AssetViewer } from './component/AssetViewer';

function App() {
  const { user } = useUserStore();
  
  return (
    <div className="bg-gray-300 container h-screen mx-auto px-4 shadow-md">
      <header className="shadow flex justify-start p-4 h-16 text-xl text-slate-800">
        <div className='flex-grow'>
          <h2>Lottie Viewer</h2>
        </div>
        <AccountDropdown />
      </header>
      <div className='bg-slate-50 shadow p-4 mt-2 h-[calc(100vh-6rem)] overflow-y-auto'>
        <div className='flex'>
          <CreateAsset />
          <SyncStatus />
        </div>
        <AssetViewer />
      </div>
      {!user && <CreateUserModal />}
    </div>
  );
}

export default App;
