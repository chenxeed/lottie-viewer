import { useState } from 'react';
import { uploadFile } from '../helper/fileUpload';
import { useUploadAsset } from '../service/useUploadAsset';

export const CreateAsset = () => {
  const [loading, setLoading] = useState(false);
  const uploadAsset = useUploadAsset(true);
  const onClickAddLottie = async () => {
    const files = await uploadFile({
      accept: '.json',
    });
    if (!files) {
      return;
    }
    setLoading(true);
    await uploadAsset(files[0]);
    setLoading(false);
  }

  return (
    <button
      className="button-shadow emerald"
      onClick={onClickAddLottie}
      disabled={loading}>
      { loading ? 'Uploading...' : 'Add Lottie' }
    </button>
  )
}
