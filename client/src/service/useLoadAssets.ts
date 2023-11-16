import { GET_ASSETS } from '../repo/graph';
import { client } from './apolloClient';
import { Criteria } from '../store/types';

interface LoadAssetOption {
  criteria: Criteria;
  after: number;
}

export const useLoadAssets = () => {
  return ({ criteria, after }: LoadAssetOption) => {
    return client.query({
      query: GET_ASSETS,
      variables: {
        criteria: criteria === Criteria.ALL ? '' : criteria,
        after
      },
      fetchPolicy: 'network-only',
    });
  }
}