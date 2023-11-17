import {
  FunctionComponent,
  MouseEvent,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import { Button, ButtonProps } from "./Button";
import clsx from "clsx";

interface DropdownProps {
  btnVariant?: ButtonProps["variant"];
  btnSize?: ButtonProps["size"];
  btnContent: string;
}
export const Dropdown: FunctionComponent<DropdownProps & PropsWithChildren> = ({
  children,
  btnContent,
  btnSize = "md",
  btnVariant = "primary",
}) => {
  // Local values

  const [open, setOpen] = useState(false);

  // Event Listeners

  const onClickDropdownButton = () => {
    setOpen(!open);
  };

  const onClickPopup = (e: MouseEvent) => {
    setOpen(!open);
  };

  return (
    <div className="relative">
      <Button
        size={btnSize}
        variant={btnVariant}
        className={clsx("peer")}
        onClick={onClickDropdownButton}
      >
        {btnContent}
      </Button>
      {open}
      <div
        className={clsx(
          "absolute right-0 top-0 mt-12 bg-white shadow-lg rounded-md z-50",
          !open && "hidden",
        )}
        onClick={onClickPopup}
      >
        {children}
      </div>
    </div>
  );
};
