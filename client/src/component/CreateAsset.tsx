import { uploadFile } from '../helper/fileUpload';
import { readFile } from '../helper/fileReader';
import { CREATE_ASSET } from '../repo/graph';
import { client } from '../apollo-client';
import { useAssetsStore } from '../store/assets';
import { useUserStore } from '../store/user';
import { ApolloError, useMutation } from '@apollo/client';

export const CreateAsset = () => {
  const { user } = useUserStore();
  const { assets, pendingAssets, setAssets, setPendingAssets }  = useAssetsStore();
  const [createAsset] = useMutation(CREATE_ASSET, { client });
  const onClickAddLottie = async () => {
    const files = await uploadFile({
      accept: '.json',
    });

    if (!files) {
      return;
    }

    // NOTE: We originally need to upload the file, but for now we will just read the file
    // and use it as the data.
    // TODO: Upload the file to the server.

    const json = await readFile(files[0]);

    createAsset({
      variables: {
        userId: user?.id,
        title: files[0].name,
        file: json,
      },
      onCompleted(data) {
        const newAsset = data.createAsset;
        setAssets([...assets, {
          id: newAsset.id,
          title: newAsset.title,
          file: newAsset.file,
          createdAt: newAsset.createdAt,
        }]);
      },
      onError(error, clientOptions) {
        console.log(error, clientOptions);
        // If the error is due to failure to save to server, we can still save it locally.
        if (!navigator.onLine || error instanceof ApolloError) {
          console.log('Failed to save to server, saving locally');
          
          setPendingAssets([...pendingAssets, {
            id: Date.now(), // Random ID since it'll be replaced with the server ID later on sync
            title: files[0].name,
            file: JSON.parse(json),
            createdAt: new Date().toISOString(),
            isPending: true,
          }]);
        } else {
          // TODO: Show notification to user
          console.error('Failed to upload the file!');
        }
      },
    })
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
      onClick={onClickAddLottie}>
      Add Lottie
    </button>
  )
}