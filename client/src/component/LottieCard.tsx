import clsx from "clsx";
import { FunctionComponent, PropsWithChildren } from "react";

interface LottieCardProps {
  title: string;
  author?: string;
  offline?: boolean;
  onClick: () => void;
}

export const LottieCard: FunctionComponent<
  LottieCardProps & PropsWithChildren
> = ({ children, title, author, offline, onClick }) => {
  return (
    <div
      className={clsx(
        "card-shadow cursor-pointer flex flex-col justify-between bg-slate-50 transition-all duration-300 ease-in-out",
        offline ? "hover:bg-orange-50" : "hover:bg-emerald-50",
      )}
      onClick={onClick}
    >
      <div className="w-full max-h-36 hover:scale-105 lg:max-h-60 lg:hover:scale-110 overflow-hidden relative transition-transform">
        {author && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 absolute top-0 left-0 z-10">
            {author}
          </span>
        )}
        {children}
      </div>
      <div
        className={clsx(
          "mt-2 px-2 py-2",
          offline ? "bg-orange-500" : "bg-emerald-500",
        )}
      >
        <div className="text-sm text-left text-light truncate">{title}</div>
      </div>
    </div>
  );
};
