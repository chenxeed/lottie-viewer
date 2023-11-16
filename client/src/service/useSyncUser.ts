import { useStateSetUser } from "../store/user";
import { client } from './apolloClient';
import { CREATE_USER } from '../repo/graph';
import { useMutation } from '@apollo/client';
import { User } from "../types";

export function useSyncUser () {
  const setUser = useStateSetUser();
  const [createUser] = useMutation(CREATE_USER, { client });

  return async (user: User) => {
    if (!user) {
      // There's no user to sync with, skipping the process
      return;
    }
    
    if (user.isSync) {
      // The user has already sync to the server
      return;
    }

    // Sync the user
    // If success, update the flag to be true
    // If fail, do nothing and let the user use the "offline" user mode
    try {
      await createUser({
        variables: {
          name: user.name,
        },
        onCompleted(data) {
          setUser({
            id: Number(data.createUser.id),
            name: data.createUser.name,
            isSync: true,
          });
        }
      });
    } catch (error) {
      console.error('Failed to sync user', error);
      // TODO: Notify the user
      throw error;
    }
  }
}
