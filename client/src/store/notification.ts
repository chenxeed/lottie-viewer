import { useStore } from ".";

export const useStateNotification = () =>
  useStore((state) => state.notification);
export const useStateSetNotification = () =>
  useStore((state) => state.setNotification);
