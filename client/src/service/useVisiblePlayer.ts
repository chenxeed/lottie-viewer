import { DotLottieCommonPlayer } from "@dotlottie/react-player";
import { useEffect, useRef } from "react";
import { findInAndOut } from "../helper/findInAndOut";

interface UseVisiblePlayerProps {
  scrollDOMRef: React.RefObject<HTMLDivElement>;
  gridDOMRef: React.RefObject<HTMLDivElement>;
}

/**
 * Given a parent DOM, this hook will determine which assets are currently visible in the viewport and play them.
 * This hook is useful when you have a grid of assets and you want to play only the assets that are visible in the viewport.
 * NOTE: For now, it only works with these certain conditions:
 * - The assets are in a grid which makes it easier to determine the number of columns
 * - The player refs are stored in the ref array, and it is a DotLottieCommonPlayer instance
 *
 * How it works:
 * First of all, we do not use `getBoundingClientRect` to determine the visible height because it sacrifice performance to calculate the element's position.
 * As tradeoff, we precalculate the container's visible height and the card's height, and use that to determine the number of assets displayed in the viewport.
 * By doing this, we can determine the possible position of assets that is currently within viewport based on the scrollTop position.
 * We use that to play the assets that are within the viewport based on their index position.
 *
 * To be improved:
 * - Support other layout as well like "flex", "float", etc when the need arises
 * - Figure out a better way to determine the number of columns
 * - Throttle or Debounce it for even better performance
 *
 * Feel free to extend for further use cases.
 */
export const useVisiblePlayer = ({
  scrollDOMRef,
  gridDOMRef,
}: UseVisiblePlayerProps) => {
  // Local State

  // dotLottiePlayers to be published to the parent component, exposing the player instance
  const dotLottiePlayers = useRef<(DotLottieCommonPlayer | null)[]>([]);
  // NOTE: the assets index starts from 0, so -1 means it is not playing anything
  const currentlyPlayingRef = useRef<[number, number]>([-1, -1]);

  // Side Effects

  useEffect(() => {
    const scrollDOM = scrollDOMRef.current;
    const gridDOM = gridDOMRef.current;

    const onScrollEvent = () => {
      if (
        scrollDOM === null ||
        gridDOM === null ||
        dotLottiePlayers.current.length === 0
      ) {
        return;
      }
      const cardDom =
        dotLottiePlayers.current[0]?.container?.closest(".card-shadow"); // TODO: Give more specific selector
      if (!cardDom) {
        return;
      }

      // Read the current parent's DOM that can determine each assets position

      const containerVisibleHeight = scrollDOM.clientHeight;
      const containerScrollTop = scrollDOM.scrollTop;
      const cardHeight = cardDom.clientHeight;

      // Determine the grid factors that determine the gap between each assets and number of columns

      const gridDOMComputedStyle = getComputedStyle(gridDOM);
      const rowGap = parseInt(gridDOMComputedStyle.rowGap);
      const numberOfVisibleColumns =
        gridDOMComputedStyle.gridTemplateColumns.split(" ").length;

      // Determine the possible position of assets that is currently within viewport based on the scrollTop position

      const cardHeightSpace = cardHeight + rowGap;
      const visibleRowPosition = Math.floor(
        containerScrollTop / cardHeightSpace,
      );

      // Determine the number of assets that can be displayed in the viewport

      const numberOfVisibleRows = Math.ceil(
        containerVisibleHeight / cardHeightSpace,
      );
      const numberOfVisibleAssets =
        numberOfVisibleRows * numberOfVisibleColumns;
      const possibleStartPosition = visibleRowPosition * numberOfVisibleColumns;
      const possibleEndPosition =
        possibleStartPosition + numberOfVisibleAssets - 1; // Minus 1 because the index starts from 0

      if (
        currentlyPlayingRef.current[0] === possibleStartPosition &&
        currentlyPlayingRef.current[1] === possibleEndPosition
      ) {
        return;
      }

      // Find the assets that are in and out of the viewport, to be played and paused respectively
      const { in: toBePlayed, out: toBePaused } = findInAndOut(
        currentlyPlayingRef.current,
        [possibleStartPosition, possibleEndPosition],
      );

      // Update the refs to be used in the next scroll event
      currentlyPlayingRef.current = [
        possibleStartPosition,
        possibleEndPosition,
      ];

      toBePaused.forEach((i) => {
        if (dotLottiePlayers.current[i]) {
          dotLottiePlayers.current[i]?.pause();
        }
      });
      toBePlayed.forEach((i) => {
        if (dotLottiePlayers.current[i]) {
          dotLottiePlayers.current[i]?.play();
        }
      });
    };

    if (scrollDOM) {
      scrollDOM.addEventListener("scroll", onScrollEvent);
    }

    return () => {
      if (scrollDOM) {
        scrollDOM.removeEventListener("scroll", onScrollEvent);
      }
    };
  }, []);

  return { dotLottiePlayers, currentlyPlayingRef };
};
