import { DotLottiePlayer, Controls } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";

export const Preview = (props: { source: string }) => {
  return (
    <>
      <div className="flex items-center border-b-2 mt-2">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Preview your animation
        </h3>
      </div>
      <DotLottiePlayer renderer="canvas" autoplay loop src={props.source}>
        <Controls />
      </DotLottiePlayer>
    </>
  );
};
