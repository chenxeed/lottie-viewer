import { Controls, Player } from '@lottiefiles/react-lottie-player';

export const Preview = (props: { jsonString: string }) => {

  return (
    <>
      <div className="flex items-center border-b-2 mt-2">
        <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Preview your animation</h3>
      </div>
      <Player style={{ height: 200 }} autoplay loop src={props.jsonString}>
        <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
      </Player>
    </>
  )
}