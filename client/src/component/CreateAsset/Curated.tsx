import { useQuery } from "@apollo/client";
import { FEATURED_PUBLIC_ANIMATIONS } from "../../repo/lottie-graphql/graph";
import { lottieClient } from "../../repo/lottie-graphql/client";
import { IntersectionElement } from "../IntersectionElement";
import { useCallback, useRef } from "react";
import { LottieCard } from "../LottieCard";
import { Button } from "../../atoms/Button";
import { Skeleton } from "../../atoms/Skeleton";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { useVisiblePlayer } from "../../service/useVisiblePlayer";

export const Curated = (props: {
  onChooseLottieUrl: (lottieUrl: string, slugName: string) => void;
}) => {
  // Service Hooks

  const scrollDOMRef = useRef<HTMLDivElement>(null);
  const gridDOMRef = useRef<HTMLDivElement>(null);
  const { dotLottiePlayers } = useVisiblePlayer({ scrollDOMRef, gridDOMRef });

  // API Hooks

  const { data, loading, error, refetch, fetchMore } = useQuery(
    FEATURED_PUBLIC_ANIMATIONS,
    {
      client: lottieClient,
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    },
  );

  // NOTE: Since `onScrollToBottom` is a callback function that's used upon intersection,
  // it'll get the outdated value from the time it's created.
  // Thus, we need to use the refs to get the latest state.
  const dataRef = useRef(data);
  dataRef.current = data;
  const loadingRef = useRef(loading);
  loadingRef.current = loading;
  const onScrollToBottom = useCallback(() => {
    if (loadingRef.current) {
      return;
    }
    fetchMore({
      variables: {
        after: dataRef.current?.featuredPublicAnimations.pageInfo.endCursor,
      },
    });
  }, [fetchMore]);

  return (
    <>
      <div className="flex items-center border-b-2 mt-2">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Get the best from LottieFiles Featured Animation
        </h3>
      </div>

      <div className="h-[65vh] sm:h-[70vh] overflow-y-auto" ref={scrollDOMRef}>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-4"
          ref={gridDOMRef}
        >
          {data?.featuredPublicAnimations.edges.map((edge, index) => (
            <LottieCard
              key={edge.node.id}
              title={edge.node.name}
              onClick={() =>
                edge.node.lottieUrl &&
                props.onChooseLottieUrl(edge.node.lottieUrl, edge.node.slug)
              }
            >
              {edge.node.lottieUrl ? (
                <DotLottiePlayer
                  ref={(player) => {
                    dotLottiePlayers.current[index] = player;
                  }}
                  autoplay={
                    index <
                    10 /* Only autoplay the first 10, since the rest will be played upon user scroll */
                  }
                  renderer="canvas"
                  loop
                  src={edge.node.lottieUrl}
                />
              ) : (
                <div className="text-warning">dotLottie not available</div>
              )}
            </LottieCard>
          ))}

          {!loading && error && (
            <div className="text-danger">
              Fail to load featured public animations. Please check your
              internet connection and try again.
              <Button variant="info" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          )}

          {loading ? (
            <Skeleton width={"100%"} height={150} />
          ) : (
            <IntersectionElement onIntersect={onScrollToBottom} />
          )}
        </div>
      </div>
    </>
  );
};
