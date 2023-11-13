import { uploadFile } from '../helper/fileUpload';
import { readFile } from '../helper/fileReader';
import { CREATE_ASSET } from '../repo/graph';
import { client } from '../apollo-client';
import { useStore } from '../repo/state';
import { useMutation } from '@apollo/client';

export const CreateAsset = () => {
  const user = useStore((state) => state.user);
  const assets = useStore((state) => state.assets);
  const setAssets = useStore((state) => state.setAssets);
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
        }]);
      }
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