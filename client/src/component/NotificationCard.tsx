import { Alert, Box, Collapse, IconButton } from "@mui/material";
import { useStateNotification } from "../store/notification";
import { useCallback, useEffect, useState } from "react";

export const NotificationCard = () => {
  const notification = useStateNotification();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (notification?.message) {
      setOpen(true);
    }
  }, [notification]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Box className="fixed z-10 top-20 right-2 md:right-4 w-64 md:w:80">
      <Collapse in={open}>
        <Alert
          variant="filled"
          severity={notification?.severity}
          onClick={onClose}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <svg
                className="h-6 w-6 text-gray-400 hover:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {notification?.message}
        </Alert>
      </Collapse>
    </Box>
  );
};
