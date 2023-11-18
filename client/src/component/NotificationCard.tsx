import clsx from "clsx";
import { useStateNotification } from "../store/notification";
import { useEffect, useMemo, useState } from "react";

export const NotificationCard = () => {
  // Shared State

  const notification = useStateNotification();

  // Local values

  const [open, setOpen] = useState(false);

  // Computed values

  const severityClass = useMemo(() => {
    switch (notification?.severity) {
      case "error":
        return "bg-danger border-danger text-dark";
      case "warning":
        return "bg-warning border-warning text-dark";
      case "info":
      default:
        return "bg-info border-info text-dark";
      case "success":
        return "bg-success border-success text-dark";
    }
  }, [notification?.severity]);

  // Event Listeners

  const onClose = () => {
    setOpen(false);
  };

  // Side Effects

  useEffect(() => {
    if (notification?.message) {
      setOpen(true);
    }
  }, [notification]);

  return (
    <div
      className={clsx(
        "fixed z-50 md:right-4 w-64 md:w:80 transition-all overflow-hidden",
        open ? "w-64 h-36 top-20 right-2" : "w-0 h-0 -top-60 -right-60",
      )}
    >
      <div
        className={clsx("px-4 py-3 rounded relative z-50", severityClass)}
        role={notification?.severity}
      >
        <span className="block sm:inline">{notification?.message}</span>
        <span
          className="absolute top-0 bottom-0 right-0 px-2 py-2"
          onClick={onClose}
        >
          <svg
            className="fill-current h-6 w-6 text-dark"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    </div>
  );
};
