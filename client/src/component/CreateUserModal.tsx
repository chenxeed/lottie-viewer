import React, { useState } from 'react';
import { client } from '../apollo-client';
import { CREATE_USER } from '../repo/graph';
import { useMutation } from '@apollo/client';
import { useUserStore } from '../store/user';

export const CreateUserModal = () => {

  const [name, setName] = useState('');
  const { setUser } = useUserStore();
  const [createUser] = useMutation(CREATE_USER, { client });

  function onChangeUsername (e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function onClickContinue () {
    createUser({
      variables: {
        name,
      },
      onCompleted(data) {
        setUser({
          id: Number(data.createUser.id),
          name: data.createUser.name,
        });
      },
    });
  }

  return (
    <div className='fixed z-10 inset-0 overflow-hidden' aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className='absolute inset-0 overflow-hidden w-full h-full bg-slate-600 opacity-50' />
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Welcome!</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">We are glad you here to try out the Lottie Viewer. First, share with us your name to proceed.</p>                      
                      <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <input type="text" name="username" id="username" autoComplete="username" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Albert Mulia Shintra" onChange={onChangeUsername} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" className="inline-flex w-full justify-center rounded-md bg-stroke-n-600 px-3 py-2 text-sm font-semibold text-blue-400 shadow-sm hover:bg-stroke-linen-500 sm:ml-3 sm:w-auto" onClick={onClickContinue}>Continue!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}