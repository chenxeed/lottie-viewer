import { uploadFile } from '../helper/fileUpload';
import { readFile } from '../helper/fileReader';
import { useUploadAsset } from '../service/useUploadAsset';

export const CreateAsset = () => {
  const uploadAsset = useUploadAsset(true);
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
    const jsonString = await readFile(files[0]);
    uploadAsset(files[0].name, jsonString);
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
      onClick={onClickAddLottie}>
      Add Lottie
    </button>
  )
}