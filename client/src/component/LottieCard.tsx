import { FunctionComponent, PropsWithChildren } from "react";

interface LottieCardProps {
  title: string;
  onClick: () => void;
}

export const LottieCard: FunctionComponent<
  LottieCardProps & PropsWithChildren
> = ({ children, title, onClick }) => {
  return (
    <div
      className="card-shadow cursor-pointer bg-slate-50 hover:bg-teal-100 transition-colors duration-300 ease-in-out"
      onClick={onClick}
    >
      <div className="w-full max-h-36 hover:max-h-40 lg:max-h-60 lg:hover:max-h-64 overflow-hidden">
        {children}
      </div>
      <div className="mt-2 px-2 py-2 bg-emerald-500 ">
        <div className="text-sm text-left text-light truncate">{title}</div>
      </div>
    </div>
  );
};
