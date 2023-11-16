import { MouseEvent, useRef, useState } from "react";
import { useStateSetUser, useStateUser } from "../store/user";
import { useStateSetPendingAssets } from "../store/assets";
import { Button, Menu, MenuItem } from "@mui/material";

export const AccountDropdown = () => {
  const user = useStateUser();
  const setUser = useStateSetUser();
  const setPendingState = useStateSetPendingAssets();

  const anchorEl = useRef<Element | null>(null);
  const [open, setOpen] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    anchorEl.current = event.currentTarget;
    setOpen(true);
  };
  const handleClose = () => {
    anchorEl.current = null;
    setOpen(false);
  };

  const signOut = (e: MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    setOpen(false);
    setUser(null);
    setPendingState([]);
  };

  return (
    <div className="relative">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <span className="truncate text-left text-ellipsis w-24">
          {user?.name}
        </span>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl.current}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={(e) => signOut(e)}>Logout</MenuItem>
      </Menu>
    </div>
  );
};
