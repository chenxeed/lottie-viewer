import { GET_ASSETS } from '../repo/graph';
import { client } from '../apollo-client';
import { useStateSetAssets } from '../store/assets';


export const useLoadAssets = () => {
  const setAssets = useStateSetAssets();
  return () => client.query({
    query: GET_ASSETS,
    fetchPolicy: 'no-cache',
  }).then(({ data }) => {
    const assets = data.assets;
    if (assets) {
      setAssets(assets.map((asset: any) => ({
        id: asset.id,
        title: asset.title,
        file: JSON.parse(asset.file),
        createdAt: asset.createdAt,
      })));  
    }
  });  
}