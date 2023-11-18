import clsx from "clsx";
import React, { FunctionComponent, PropsWithChildren, useMemo } from "react";

export interface ButtonProps {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "outline-primary";
  size?: "sm" | "md" | "lg";
}

export const Button: FunctionComponent<
  ButtonProps & PropsWithChildren & React.ComponentProps<"button">
> = ({ children, variant = "primary", size = "md", className, ...props }) => {
  // Style properties

  const sizeClass = useMemo(() => {
    switch (size) {
      case "sm":
        return "text-sm px-2 py-1 w-16 h-8";
      case "md":
      default:
        return "text-md px-3 py-2 w-24 h-10";
      case "lg":
        return "text-lg px-4 py-2 w-36 h-11";
    }
  }, [size]);

  const colorClass = useMemo(() => {
    switch (variant) {
      case "primary":
      default:
        return "bg-primary text-white focus:ring-primary";
      case "secondary":
        return "bg-secondary text-white focus:ring-secondary";
      case "danger":
        return "bg-danger text-white focus:ring-danger";
      case "success":
        return "bg-success text-white focus:ring-success";
      case "warning":
        return "bg-warning text-white focus:ring-warning";
      case "info":
        return "bg-info text-white focus:ring-info";
      case "light":
        return "bg-light text-black focus:ring-light";
      case "dark":
        return "bg-dark text-white focus:ring-dark";
      case "outline-primary":
        return "bg-transparent text-primary border-primary focus:ring-primary";
    }
  }, [variant]);

  return (
    <button
      className={clsx(
        "rounded shadow hover:shadow-inner transition-shadow",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        colorClass,
        sizeClass,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
