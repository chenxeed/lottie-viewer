import { useQuery } from "@apollo/client";
import { FeaturedPublicAnimations } from "../../repo/graph";
import { lottieClient } from "../../service/apolloClient";
import { Button, Card, CardContent, CardMedia, Skeleton } from "@mui/material";
import { IntersectionElement } from "../IntersectionElement";
import { useCallback, useRef } from "react";

export const Curated = (props: {
  onChooseJSONUrl: (jsonUrl: string, slugName: string) => void;
}) => {
  const { data, loading, error, refetch, fetchMore } = useQuery(
    FeaturedPublicAnimations,
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
        <h3
          className="text-base font-semibold leading-6 text-gray-900"
          id="modal-title"
        >
          Get the best from LottieFiles Featured Public Animation
        </h3>
      </div>
      <div className="h-[60vh] lg:h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
          {data?.featuredPublicAnimations.edges.map((edge: any) => (
            <Card
              className="cursor-pointer"
              key={edge.node.id}
              sx={{ maxWidth: 345 }}
              onClick={() =>
                props.onChooseJSONUrl(edge.node.jsonUrl, edge.node.slug)
              }
            >
              <CardMedia
                sx={{ height: 140 }}
                image={edge.node.imageUrl}
                title={edge.node.name}
              />
              <CardContent>
                <div className="text-left text-xs md:text-sm lg:text-base mb-2">
                  {edge.node.name}
                </div>
              </CardContent>
            </Card>
          ))}

          {!loading && error && (
            <div className="text-red-500">
              Fail to load featured public animations. Please check your
              internet connection and try again.
              <Button variant="contained" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          )}

          {loading ? (
            <>
              <Skeleton variant="rounded" width={"100%"} height={150} />
            </>
          ) : (
            <>
              <IntersectionElement onIntersect={onScrollToBottom} />
            </>
          )}
        </div>
      </div>
    </>
  );
};
