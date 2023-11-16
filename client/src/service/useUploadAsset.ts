import { CREATE_ASSET } from '../repo/graph';
import { client } from './apolloClient';
import { ApolloError, useMutation } from '@apollo/client';
import { useStateUser } from '../store/user';
import { useStatePendingAssets, useStateSetPendingAssets } from '../store/assets';
import { uploadFileToBucket } from './fileBucket';
import { readFile } from '../helper/fileReader';
import { Criteria } from '../store/types';
import { useCallback, useRef } from 'react';
import { useStateSetNotification } from '../store/notification';

interface UploadAssetOption {
  /**
   * If true, will save the asset locally if the server is not available.
   */
  fallback: boolean;
}

/**
 * Hook to upload a new asset to the server.
 * @param fallback If true, will save the asset locally if the server is not available.
 * @returns A function to upload the asset.
 */
export function useUploadAsset (option?: UploadAssetOption) {
  const { fallback = false } = option || {};
  const user = useStateUser();
  const userRef = useRef(user);
  userRef.current = user;

  const setNotification = useStateSetNotification();

  const pendingAssets = useStatePendingAssets();
  const pendingAssetsRef = useRef(pendingAssets);
  pendingAssetsRef.current = pendingAssets;

  const setPendingAssets = useStateSetPendingAssets();
  const [createAsset] = useMutation(CREATE_ASSET, { client });

  return useCallback(async (file: File, criteria: Criteria) => {
    async function fallbackPendingAsset (file: File, criteria: Criteria) {
      const jsonString = await readFile(file);
      setPendingAssets([{
        id: Date.now(), // Random ID since it'll be replaced with the server ID later on sync
        title: file.name,
        jsonString,
        criteria,
        createdAt: new Date().toISOString(),
        isPending: true,
      }, ...pendingAssetsRef.current]);
      setNotification({ severity: 'info', message: 'Your animation uploaded into your device. Please SYNC when you are back online' });
    }
  
    // Upload the file to the server bucket, to retrieve the URL.
    // Once done, we'll use it as the pointer of the asset URL.
    // In case where the user failed to upload, we can fallback to local storage
    // temporarily for user to sync back once they're online again.
    try {
      const uploadedFile = await uploadFileToBucket(file);
      const { filename, originalname } = uploadedFile;

      const result = await createAsset({
        variables: {
          userId: userRef.current?.id,
          title: originalname,
          file: filename,
          criteria,
        }
      })
      if (result.errors) {
        throw new ApolloError({ graphQLErrors: result.errors });
      }
      return result;
    } catch (e) {
      if (fallback) {
        await fallbackPendingAsset(file, criteria);
      } else {
        throw e;
      }
    }
  }, [createAsset, fallback, setPendingAssets]); 
}