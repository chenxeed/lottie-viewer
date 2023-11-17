import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import {
  useStateAssets,
  useStateSetAssets,
  useStateCriteria,
  useStatePendingAssets,
  useStateSetViewAsset,
} from "../store/assets";
import { getFilePath } from "../service/fileBucket";
import { Criteria, PendingLottie } from "../store/types";
import { Lottie } from "../types";
import { useQuery } from "@apollo/client";
import { GET_ASSETS } from "../repo/server-graphql/graph";
import { Card, Skeleton, Typography } from "@mui/material";
import clsx from "clsx";
import { useStateSetNotification } from "../store/notification";
import { IntersectionElement } from "./IntersectionElement";
import { client } from "../repo/server-graphql/client";

interface LottieCardProps {
  title: string;
  playerSrc: string;
  isOffline?: boolean;
  onClick: () => void;
}
const LottieCard = (props: LottieCardProps) => {
  return (
    <Card className="hover:bg-slate-100 cursor-pointer" onClick={props.onClick}>
      <div className="h-28 md:h-40">
        <DotLottiePlayer
          renderer="canvas"
          loop
          autoplay
          src={props.playerSrc}
        />
      </div>
      <div className={clsx("p-2 truncate", props.isOffline && "bg-red-200")}>
        <Typography variant="caption">{props.title}</Typography>
      </div>
    </Card>
  );
};

const PendingAssetList = () => {
  const selectedCriteria = useStateCriteria();
  const pendingAssets = useStatePendingAssets();
  const setViewAsset = useStateSetViewAsset();
  const onClickDetail = (asset: PendingLottie) => {
    setViewAsset({
      title: asset.title,
      fileUrl: asset.dataUrl,
    });
  };
  return (
    <>
      {pendingAssets
        .filter(
          ({ criteria }) =>
            selectedCriteria === Criteria.ALL || selectedCriteria === criteria,
        )
        .map((asset) => (
          <LottieCard
            key={asset.id}
            onClick={() => onClickDetail(asset)}
            isOffline={true}
            title={asset.title}
            playerSrc={asset.dataUrl}
          />
        ))}
    </>
  );
};

const AssetList = () => {
  const assets = useStateAssets();
  const setViewAsset = useStateSetViewAsset();
  const onClickDetail = async (asset: Lottie) =>
    setViewAsset({
      title: asset.title,
      fileUrl: getFilePath(asset.file),
    });

  return (
    <>
      {assets.map((asset) => (
        <LottieCard
          key={asset.id}
          onClick={() => onClickDetail(asset)}
          title={asset.title}
          playerSrc={getFilePath(asset.file)}
        />
      ))}
    </>
  );
};

const EmptyList = () => {
  const assets = useStateAssets();
  const pendingAssets = useStatePendingAssets();
  const criteria = useStateCriteria();
  const isEmpty = useMemo(
    () => assets.length === 0 && pendingAssets.length === 0,
    [assets, pendingAssets],
  );
  const emptyMessage = useMemo(() => {
    if (!isEmpty) {
      return "";
    }
    if (criteria === Criteria.ALL) {
      return "Fresh start! Try to upload one!";
    } else {
      return `No assets found on ${criteria}. Try to upload one!`;
    }
  }, [criteria, isEmpty]);
  return (
    <>
      {isEmpty && (
        <div className="text-center text-gray-500 text-xl font-semibold mt-4 mx-auto">
          {emptyMessage}
        </div>
      )}
    </>
  );
};

export const AssetViewer = () => {
  const criteria = useStateCriteria();
  const setAssets = useStateSetAssets();
  const setNotification = useStateSetNotification();

  const ASSET_PER_PAGE = 20;

  // NOTE: Make sure any changes of the variable here is also reflected in the `fetchMore` function
  // and the `merge` cache strategy in the apolloClient.
  const { data, error, loading, fetchMore } = useQuery(GET_ASSETS, {
    variables: {
      criteria: criteria === Criteria.ALL ? undefined : criteria,
      before: 0,
      limit: ASSET_PER_PAGE,
    },
    client,
    fetchPolicy: "network-only", // Always try to retrieve the latest first
    notifyOnNetworkStatusChange: true,
    refetchWritePolicy: "merge",
  });

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
        criteria: criteria === Criteria.ALL ? undefined : criteria,
        before: dataRef.current?.assets.pageInfo.endCursor,
        limit: ASSET_PER_PAGE,
      },
    }).catch((e) => {
      console.error("AssetViewer: Fail to fetch more assets", e);
      setNotification({
        severity: "error",
        message:
          "Fail to retrieve more assets. Please check your internet connection and try again.",
      });
    });
  }, [fetchMore, criteria, setNotification]);

  useEffect(() => {
    if (data?.assets) {
      setAssets(
        data.assets.nodes.map((asset) => ({
          id: asset.id,
          title: asset.title,
          file: asset.file,
          criteria: asset.criteria as Criteria,
          createdAt: asset.createdAt,
        })),
      );
    }
  }, [data, setAssets, setNotification]);

  useEffect(() => {
    if (error) {
      setNotification({
        severity: "error",
        message: "Fail to retrieve assets. Please try again.",
      });
    }
  }, [error, setNotification]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
        <PendingAssetList />
        <AssetList />
        {data?.assets?.pageInfo?.hasPreviousPage && (
          <IntersectionElement onIntersect={onScrollToBottom} />
        )}
      </div>
      {loading ? <Skeleton width={"100%"} height={200} /> : <EmptyList />}
    </>
  );
};
