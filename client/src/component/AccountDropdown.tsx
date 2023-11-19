import { MouseEvent } from "react";
import { useStateSetUser, useStateUser } from "../store/user";
import { useStateSetPendingAssets } from "../store/assets";
import { Dropdown } from "../atoms/Dropdown";
import { Button } from "../atoms/Button";

export const AccountDropdown = () => {
  // Shared state
  const user = useStateUser();
  const setUser = useStateSetUser();
  const setPendingState = useStateSetPendingAssets();

  // Event Listeners

  // Upon user signed out, we make sure there's no trace left from the previous user
  const signOut = (e: MouseEvent<HTMLButtonElement>) => {
    setUser(null);
    setPendingState([]);
  };

  return (
    <Dropdown btnVariant="outline-primary" btnContent={user?.name || ""}>
      <Button onClick={signOut}>Logout</Button>
    </Dropdown>
  );
};
