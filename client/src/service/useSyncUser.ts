import { useStateSetUser, useStateUser } from "../store/user";
import { CREATE_USER } from "../repo/server-graphql/graph";
import { useMutation } from "@apollo/client";
import { useRef } from "react";
import { useStateSetNotification } from "../store/notification";
import { client } from "../repo/server-graphql/client";

export function useSyncUser() {
  const user = useStateUser();
  const userRef = useRef(user);
  const setNotification = useStateSetNotification();
  userRef.current = user;

  const setUser = useStateSetUser();
  const [createUser] = useMutation(CREATE_USER, { client });

  return async () => {
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
      const result = await createUser({
        variables: {
          name: user.name,
        },
      });
      const data = result.data;
      if (!data) {
        throw new Error("No created user data returned from the server");
      }
      setUser({
        id: Number(data.createUser.id),
        name: data.createUser.name,
        isSync: true,
      });
    } catch (error) {
      console.error("Failed to sync user", error);
      setNotification({
        severity: "error",
        message: "Failed to sync user, still under Offline mode",
      });
    }
  };
}
