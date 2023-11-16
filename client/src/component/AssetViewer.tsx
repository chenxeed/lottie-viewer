import React, { useEffect, useMemo, useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  useStateAssets,
  useStateSetAssets,
  useStateCriteria,
  useStatePendingAssets,
  useStateSetViewAsset,
} from "../store/assets";
import { fetchFileContentFromBucket, getFilePath } from "../service/fileBucket";
import { Criteria, PendingLottie } from "../store/types";
import { Lottie } from "../types";
import { useQuery } from "@apollo/client";
import { GET_ASSETS } from "../repo/graph";
import { client } from "../service/apolloClient";
import { Card, CardContent } from "@mui/material";
import clsx from "clsx";
import { useStateSetNotification } from "../store/notification";

interface LottieCardProps {
  title: string;
  playerSrc: string;
  isOffline?: boolean;
  onClick: () => void;
}
const LottieCard = (props: LottieCardProps) => {
  const ref = useRef<Player>(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      ref.current?.setSeeker(50);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <Card className="hover:bg-slate-100 cursor-pointer" onClick={props.onClick}>
      <Player ref={ref} src={props.playerSrc} className="h-20 md:h-40" />
      <CardContent className={clsx(props.isOffline && "bg-red-200")}>
        <div
          className={clsx(
            "text-left text-xs md:text-sm lg:text-base mb-2",
            props.isOffline && "text-red-950",
          )}
        >
          {props.title}
        </div>
      </CardContent>
    </Card>
  );
};

const PendingAssetList = () => {
  const selectedCriteria = useStateCriteria();
  const pendingAssets = useStatePendingAssets();
  const setViewAsset = useStateSetViewAsset();
  const onClickDetail = (asset: PendingLottie) =>
    setViewAsset({
      title: asset.title,
      jsonString: asset.jsonString,
    });
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
            playerSrc={asset.jsonString}
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
      jsonString: await fetchFileContentFromBucket(asset.file),
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

  const { data, error } = useQuery(GET_ASSETS, {
    variables: {
      criteria: criteria === Criteria.ALL ? undefined : criteria,
      after: 0,
    },
    client,
    fetchPolicy: "network-only", // Always try to retrieve the latest first
  });

  useEffect(() => {
    if (data?.assets) {
      setAssets(
        data.assets.map((asset: any) => ({
          id: asset.id,
          title: asset.title,
          file: asset.file,
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
      <EmptyList />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
        <PendingAssetList />
        <AssetList />
      </div>
    </>
  );
};
