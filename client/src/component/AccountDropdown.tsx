import { useState } from "react";
import { useStore } from "../repo/state";

export const AccountDropdown = () => {

  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [toggle, setToggle] = useState(false);

  const signOut = (e: MouseEvent) => {
    e.preventDefault();
    setToggle(false);
    setUser(null);
  }

  return (
    <div className="relative">
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button" onClick={() => setToggle(!toggle)}>
        {user?.name}<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
        
      </button>

      <div id="dropdown" className={`z-10 ${toggle ? '' : 'hidden'} absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-24 py-2 text-sm text-gray-700 dark:text-gray-200`}>
        <button onClick={e => signOut(e as unknown as MouseEvent)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</button>
      </div>    
    </div>
  )
};
