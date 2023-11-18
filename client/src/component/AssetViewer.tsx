import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  DotLottieCommonPlayer,
  DotLottiePlayer,
} from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import {
  useStateAssets,
  useStateSetAssets,
  useStateCriteria,
  useStatePendingAssets,
  useStateSetViewAsset,
  useStatePendingAssetsByCriteria,
} from "../store/assets";
import { getFilePath } from "../service/fileBucket";
import { Criteria, Lottie, PendingLottie } from "../store/types";
import { useQuery } from "@apollo/client";
import { GET_ASSETS } from "../repo/server-graphql/graph";
import { useStateSetNotification } from "../store/notification";
import { IntersectionElement } from "./IntersectionElement";
import { client } from "../repo/server-graphql/client";
import { LottieCard } from "./LottieCard";
import { Skeleton } from "../atoms/Skeleton";
import { useVisiblePlayer } from "../service/useVisiblePlayer";

const DotLottiePlayerContext = createContext<(DotLottieCommonPlayer | null)[]>(
  [],
);

interface LottieCardProps {
  title: string;
  user: string;
  playerSrc: string;
  isOffline?: boolean;
  onClick: () => void;
  index: number;
}
const Thumbnail = (props: LottieCardProps) => {
  const dotLottiePlayers = useContext(DotLottiePlayerContext);

  return (
    <LottieCard title={props.title} author={props.user} onClick={props.onClick}>
      <DotLottiePlayer
        ref={(player) => {
          dotLottiePlayers[props.index] = player;
        }}
        autoplay={
          props.index <
          10 /* Only autoplay the first 10, since the rest will be played upon user scroll */
        }
        renderer="svg"
        loop
        src={props.playerSrc}
      />
    </LottieCard>
  );
};

const PendingAssetList = () => {
  const pendingAssets = useStatePendingAssetsByCriteria();
  const setViewAsset = useStateSetViewAsset();
  const onClickDetail = (asset: PendingLottie) => {
    setViewAsset({
      title: asset.title,
      fileUrl: asset.dataUrl,
      user: asset.user,
    });
  };
  return (
    <>
      {pendingAssets.map((asset, index) => (
        <Thumbnail
          index={index}
          key={asset.id}
          onClick={() => onClickDetail(asset)}
          isOffline={true}
          title={`${asset.criteria} - ${asset.title}`}
          playerSrc={asset.dataUrl}
          user={asset.user}
        />
      ))}
    </>
  );
};

const AssetList = () => {
  const pendingAssets = useStatePendingAssetsByCriteria();
  const assets = useStateAssets();
  const setViewAsset = useStateSetViewAsset();
  const onClickDetail = async (asset: Lottie) =>
    setViewAsset({
      title: asset.title,
      fileUrl: getFilePath(asset.file),
      user: asset.user,
    });

  return (
    <>
      {assets.map((asset, index) => (
        <Thumbnail
          index={pendingAssets.length + index}
          key={asset.id}
          onClick={() => onClickDetail(asset)}
          title={`${asset.criteria} - ${asset.title}`}
          playerSrc={getFilePath(asset.file)}
          user={asset.user}
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

interface AssetViewerProps {
  scrollDOMRef: React.RefObject<HTMLDivElement>;
}
export const AssetViewer = ({ scrollDOMRef }: AssetViewerProps) => {
  // Constants

  const ASSET_PER_PAGE = 20;

  // Shared state

  const criteria = useStateCriteria();
  const setAssets = useStateSetAssets();
  const setNotification = useStateSetNotification();

  // Service Hooks
  const gridDOMRef = useRef<HTMLDivElement>(null);
  const { dotLottiePlayers } = useVisiblePlayer({ scrollDOMRef, gridDOMRef });

  // API Hooks

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

  // Side Effects

  useEffect(() => {
    if (data?.assets) {
      setAssets(
        data.assets.nodes.map((asset) => ({
          id: asset.id,
          title: asset.title,
          file: asset.file,
          criteria: asset.criteria as Criteria,
          createdAt: asset.createdAt,
          user: asset.user?.name || "",
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
    <DotLottiePlayerContext.Provider value={dotLottiePlayers.current}>
      <div
        className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-4 px-1"
        ref={gridDOMRef}
      >
        <PendingAssetList />
        <AssetList />

        {data?.assets?.pageInfo?.hasPreviousPage && (
          <IntersectionElement onIntersect={onScrollToBottom} />
        )}
      </div>

      {loading ? <Skeleton width={"100%"} height={200} /> : <EmptyList />}
    </DotLottiePlayerContext.Provider>
  );
};
