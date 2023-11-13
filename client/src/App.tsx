import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import './App.css';
import { useStore } from './repo/state';
import { CreateUserModal } from './component/CreateUserModal';
import { AccountDropdown } from './component/AccountDropdown';
import { CreateAsset } from './component/CreateAsset';

function App() {
  const user = useStore((state) => state.user);
  const assets = useStore((state) => state.assets);
  
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
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
          {assets.map(asset => (
            <button key={asset.id} className="max-w-sm rounded overflow-hidden shadow-lg">
              <Player src={asset.file} />
              <div className="px-6 py-4">
                <div className="font-bold text-base mb-2">{asset.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {!user && <CreateUserModal />}
    </div>
  );
}

export default App;
