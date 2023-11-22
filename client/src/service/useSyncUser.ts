import { useStateSetUser, useStateUser } from "../store/user";
import { CREATE_USER } from "../repo/server-graphql/graph";
import { useMutation } from "@apollo/client";
import { client } from "../repo/server-graphql/client";
import { User } from "../store/types";
import { ServiceResult } from "./types";

/**
 * Service to sync the user local ID to the server.
 * Only once user are sync, they can upload their assets to the server,
 * otherwise their assets will remain offline. User can still use the app while not sync.
 *
 * This service mainly used to keep user data in sync between the client and the server.
 */
export function useSyncUser() {
  // Shared state

  const user = useStateUser();
  const setUser = useStateSetUser();
  const [createUser] = useMutation(CREATE_USER, { client });

  // Service hooks for the components
  // Here's the process:
  // 1. Check if the user is already sync or not, based on the `isSync` flag
  // 2. If already sync, do nothing and user can proceed to their flow
  // 3. If not sync, create the user to the server
  return async (newUser?: User): Promise<ServiceResult<User>> => {
    const checkUser = newUser || user;
    if (!checkUser) {
      throw new Error("SyncUser: User is not set");
    }

    if (checkUser.isSync) {
      // The user has already sync to the server
      return {
        data: checkUser,
        error: null,
      };
    }

    // Sync the user
    // If success, update the flag to be true
    // If fail, do nothing and let the user use the "offline" user mode
    try {
      const result = await createUser({
        variables: {
          name: checkUser.name,
        },
      });
      const data = result.data;
      if (!data) {
        return {
          data: checkUser,
          error: new Error("No created user data returned from the server"),
        };
      }
      const newUser = {
        id: Number(data.createUser.id),
        name: data.createUser.name,
        isSync: true,
      };
      setUser(newUser);
      return {
        data: newUser,
        error: null,
      };
    } catch (error) {
      return {
        data: checkUser,
        error,
      };
    }
  };
}
