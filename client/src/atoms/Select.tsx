import clsx from "clsx";
import { ComponentProps, FunctionComponent, useRef } from "react";

interface SelectProps {
  label?: string;
  options: { value: string; label: string }[];
  selected?: string;
}
export const Select: FunctionComponent<
  SelectProps & ComponentProps<"select">
> = ({ options, selected, label, className, ...props }) => {
  const randomIdForLabel = useRef(
    `label-${Math.round(Math.random() * 10000000)}`,
  );

  return (
    <>
      <label
        htmlFor={randomIdForLabel.current}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={randomIdForLabel.current}
        className={clsx(
          "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};
