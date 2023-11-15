import { CREATE_ASSET } from '../repo/graph';
import { client } from '../apollo-client';
import { ApolloError, useMutation } from '@apollo/client';
import { useStateUser } from '../store/user';
import { useStateAssets, useStatePendingAssets, useStateSetAssets, useStateSetPendingAssets } from '../store/assets';
import { uploadFileToBucket } from './fileBucket';
import { readFile } from '../helper/fileReader';
import { Criteria } from '../store/types';


/**
 * Hook to upload a new asset to the server.
 * @param fallback If true, will save the asset locally if the server is not available.
 * @returns A function to upload the asset.
 */
export function useUploadAsset (fallback = false) {
  const user = useStateUser();
  const assets = useStateAssets();
  const pendingAssets = useStatePendingAssets();
  const setAssets = useStateSetAssets();
  const setPendingAssets = useStateSetPendingAssets();
  const [createAsset] = useMutation(CREATE_ASSET, { client });

  async function fallbackPendingAsset (file: File, criteria: Criteria) {
    const jsonString = await readFile(file);
    setPendingAssets([{
      id: Date.now(), // Random ID since it'll be replaced with the server ID later on sync
      title: file.name,
      jsonString,
      criteria,
      createdAt: new Date().toISOString(),
      isPending: true,
    }, ...pendingAssets]);
  }

  return async (file: File, criteria: Criteria) => {

    // Upload the file to the server bucket, to retrieve the URL.
    // Once done, we'll use it as the pointer of the asset URL.
    // In case where the user failed to upload, we can fallback to local storage
    // temporarily for user to sync back once they're online again.
    try {
      const uploadedFile = await uploadFileToBucket(file);
      const { filename, originalname } = uploadedFile;

      const result = await createAsset({
        variables: {
          userId: user?.id,
          title: originalname,
          file: filename,
          criteria,
        },
        onCompleted(data) {
          const newAsset = data.createAsset;
          setAssets([{
            id: newAsset.id,
            title: newAsset.title,
            file: newAsset.file,
            criteria: newAsset.criteria,
            createdAt: newAsset.createdAt,
          }, ...assets]);
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
  } 
}