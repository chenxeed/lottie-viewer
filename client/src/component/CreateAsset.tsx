import { ChangeEvent, useEffect, useState } from 'react';
import { uploadFile } from '../helper/fileUpload';
import { useUploadAsset } from '../service/useUploadAsset';
import clsx from 'clsx';
import { Controls, Player } from '@lottiefiles/react-lottie-player';
import { readFile } from '../helper/fileReader';
import { Criteria } from '../store/types';
import { useSyncAssets } from '../service/useSyncAssets';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button } from '@mui/material';
import { createPortal } from 'react-dom';
import { useSyncUser } from '../service/useSyncUser';
import { useStateSetNotification } from '../store/notification';

const criteriaOption = [
  Criteria.GAME,
  Criteria.NATURE,
  Criteria.PEOPLE,
  Criteria.SCIENCE,
  Criteria.SHAPE,
  Criteria.TECH,
]

export const CreateAsset = () => {
  const [openModal, setOpenModal] = useState(false);
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const [jsonString, setJsonString] = useState<string | null>(null);
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria>(Criteria.TECH);
  const [loading, setLoading] = useState(false);
  const syncUser = useSyncUser();
  const uploadAsset = useUploadAsset({ fallback: true });
  const syncAssets = useSyncAssets();
  const setNotification = useStateSetNotification();
  
  const onClickChooseFile = async () => {
    const files = await uploadFile({
      accept: '.json',
    });
    if (!files) {
      return;
    }
    setChosenFile(files[0]);
  }

  const onClickSubmit = async () => {
    if (!chosenFile || !selectedCriteria) {
      setNotification({ severity: 'info', message: 'Please choose a file and select the category' });
      return;
    }
    setLoading(true);

    // Before the file gets uploaded, make sure if the user has sync to the server
    // If the user hasn't, consider the app is still in offline mode and user can continue
    // uploading it to their local storage temporarily.

    try {
      await syncUser();
    
      const data = await uploadAsset(chosenFile, selectedCriteria);
      if (!data?.errors) {
        onClose();
        // Sync the latest assets from the server, by checking the last sync status
        await syncAssets();
      }  
    } catch (e) {
      console.error('Fail to upload', e);
      setNotification({ severity: 'error', message: 'Fail to upload. Please try again.' });
    }
    setLoading(false);
  }

  useEffect(() => {
    if (chosenFile) {
      readFile(chosenFile).then((content) => {
        setJsonString(content);
      });
    } else {
      setJsonString(null);
    }
  }, [chosenFile]);
  
  const onChangeCriteria = (ev: SelectChangeEvent) => {
    ev.preventDefault();
    const target = ev.target as HTMLSelectElement;
    const value = target.value as Criteria;
    setSelectedCriteria(value);
  }


  const onClose = () => {
    setChosenFile(null);
    setJsonString(null);
    setOpenModal(false);
  }

  return (
    <>
      <Button
        variant='contained'
        size='small'
        className='w-24 text-xs md:w-32 md:text-base'
        onClick={() => setOpenModal(true)}
        disabled={loading}>
        { loading ? 'Adding...' : 'Add Lottie' }
      </Button>
      {createPortal(
        <div
          className={clsx('fixed z-10 inset-0 overflow-hidden', openModal ? 'opacity-100 transition-all translate-y-0' : 'h-0 w-0 opacity-0 -translate-y-60')}
          aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className='absolute inset-0 overflow-hidden w-full h-full bg-slate-600 opacity-50' />
          <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-4xl min-h-[95vh] min-w-[320px]">
                  <div className="absolute top-2 right-2">
                    <button type="button" className="inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={onClose}>
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>                  
                    </button>
                  </div>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <div className="flex items-center border-b-2 border-emerald-300 pb-2">
                        <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Upload new asset</h3>
                      </div>
                      <div className='lg:flex'>
                        <div className="mt-2 w-full">
                          <button
                            className="button-shadow emerald"
                            onClick={onClickChooseFile}
                            disabled={loading}>
                            Choose File
                          </button>
                          {jsonString && (<>
                            <div className="flex items-center border-b-2 mt-2">
                              <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Preview your animation</h3>
                            </div>
                            <Player style={{ height: 320 }} autoplay loop src={jsonString}>
                              <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
                            </Player>
                            <div className="flex items-center border-b-2 mt-2">
                              <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Select the category</h3>
                            </div>
                            <Box sx={{ minWidth: 120 }}>
                              <FormControl fullWidth>
                                <Select
                                  id="filter-criteria"
                                  value={selectedCriteria}
                                  onChange={onChangeCriteria}
                                >
                                  {criteriaOption.map((criteria, idx) => (
                                    <MenuItem key={idx} value={criteria}>
                                      {criteria}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                            <button
                              className="button-shadow emerald mt-4"
                              onClick={onClickSubmit}
                              disabled={loading}>
                              { loading ? 'Uploading...' : 'Submit!' }
                            </button>
                        </>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
