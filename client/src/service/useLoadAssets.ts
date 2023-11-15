import { GET_ASSETS } from '../repo/graph';
import { client } from '../apollo-client';
import { useStateSetAssets } from '../store/assets';

export const useLoadAssets = () => {
  const setAssets = useStateSetAssets();
  return () => {
    console.log("fetching query");
    client.query({
      query: GET_ASSETS,
      fetchPolicy: 'network-only',
    }).then(({ data }) => {
      const assets = data.assets;
      if (assets) {
        setAssets(assets.map((asset: any) => ({
          id: asset.id,
          title: asset.title,
          file: asset.file,
          createdAt: asset.createdAt,
        })));  
      }
    });
  }
}