import { FunctionComponent } from "react";

interface SkeletonProps {
  width: number | string;
  height: number | string;
}
export const Skeleton: FunctionComponent<SkeletonProps> = ({
  width,
  height,
}) => {
  return (
    <div className="animate-pulse rounded">
      <div className="bg-gray-200 rounded-md" style={{ width, height }} />
    </div>
  );
};
