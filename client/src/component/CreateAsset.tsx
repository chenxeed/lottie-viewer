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
      className="button-shadow emerald"
      onClick={onClickAddLottie}>
      Add Lottie
    </button>
  )
}