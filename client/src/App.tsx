import React from 'react';
import { CreateUserModal } from './component/CreateUserModal';
import { AccountDropdown } from './component/AccountDropdown';
import { CreateAsset } from './component/CreateAsset';
import { useStateUser } from './store/user';
import { SyncStatus } from './component/SyncStatus';
import { AssetViewer } from './component/AssetViewer';

function App() {
  const user = useStateUser();
  
  return (
    <div className="bg-gray-300 h-screen shadow-md">
      <header className="shadow flex bg-slate-100 justify-start p-4 h-16 text-xl text-slate-800">
        <div className='flex-grow'>
          <h2>Lottie Viewer</h2>
        </div>
        <AccountDropdown />
      </header>
      <div className='container mx-auto bg-slate-50 shadow p-4 mt-2 h-[calc(100vh-6rem)] overflow-y-auto'>
        <div className='flex justify-between'>
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
