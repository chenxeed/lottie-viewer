import { CREATE_ASSET } from '../repo/graph';
import { client } from '../apollo-client';
import { ApolloError, useMutation } from '@apollo/client';
import { useStateUser } from '../store/user';
import { useStateAssets, useStatePendingAssets, useStateSetAssets, useStateSetPendingAssets } from '../store/assets';


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

  return (fileName: string, jsonString: string) => {
    return createAsset({
      variables: {
        userId: user?.id,
        title: fileName,
        file: jsonString,
      },
      onCompleted(data) {
        const newAsset = data.createAsset;
        setAssets([{
          id: newAsset.id,
          title: newAsset.title,
          file: newAsset.file,
          createdAt: newAsset.createdAt,
        }, ...assets]);
      },
      onError(error) {
        // If the error is due to failure to save to server, we can still save it locally.
        if (fallback && (!navigator.onLine || error instanceof ApolloError)) {
          console.warn('Failed to save to server, saving locally');
          setPendingAssets([{
            id: Date.now(), // Random ID since it'll be replaced with the server ID later on sync
            title: fileName,
            file: JSON.parse(jsonString),
            createdAt: new Date().toISOString(),
            isPending: true,
          }, ...pendingAssets]);
        } else {
          // TODO: Show notification to user
          console.error('Failed to upload the file!', error);
        }
      },
    })
  } 
}