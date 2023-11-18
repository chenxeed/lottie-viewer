import { FunctionComponent, PropsWithChildren } from "react";

interface LottieCardProps {
  title: string;
  onClick: () => void;
}

export const LottieCard: FunctionComponent<
  LottieCardProps & PropsWithChildren
> = ({ children, title, onClick }) => {
  return (
    <div className="card-shadow cursor-pointer" onClick={onClick}>
      <div className="w-full max-h-36 lg:max-h-60 overflow-hidden">
        {children}
      </div>
      <div className="mt-2 px-2">
        <div className="text-sm text-left text-secondary truncate">{title}</div>
      </div>
    </div>
  );
};
