import { lottieClient } from "../repo/lottie-graphql/client";
import { FEATURED_PUBLIC_ANIMATIONS } from "../repo/lottie-graphql/graph";
import { client } from "../repo/server-graphql/client";
import { GET_ASSETS } from "../repo/server-graphql/graph";
import { ASSET_PER_PAGE } from "../store/assets";
import { Criteria } from "../store/types";

interface PreloadCallbacks {
  onStart: () => void;
  onProgress: (progress: number, total: number, fail: number) => void;
  onDone: (progress: number, total: number, fail: number) => void;
  onError?: (progress: number, total: number, fail: number) => void;
}

// Determine how long the user shall wait before they can continue the app, in case the preload takes too long
const PRELOAD_TIMEOUT = 5000;

/**
 * Preload the lottie public animations library for offline use.
 * Mainly focusing on the source URL
 */
export const preloadResources = (cb: PreloadCallbacks): void => {
  cb.onStart();
  let progress = 0;
  let total = 0;
  let fail = 0;
  let lottieClientOnProgress = false;
  let serverAssetsOnProgress = false;
  let timeout: ReturnType<typeof setTimeout>;

  // In case, this may takes too long, we'll let the user go to explore the app anyway. Time limit is 30s
  timeout = setTimeout(() => {
    cb.onDone(progress, total, fail);
  }, PRELOAD_TIMEOUT);

  function checkIfDone() {
    if (
      lottieClientOnProgress &&
      serverAssetsOnProgress &&
      progress === total
    ) {
      clearTimeout(timeout);
      cb.onDone(progress, total, fail);
    }
  }

  function updateProgress(newProgress = 1) {
    progress += newProgress;
    cb.onProgress(progress, total, fail);
  }

  function updateFail() {
    fail++;
    cb.onError?.(progress, total, fail);
  }

  // Preload the featured public animations from LottieFiles GraphQL API

  lottieClient
    .query({
      query: FEATURED_PUBLIC_ANIMATIONS,
    })
    .then((result) => {
      lottieClientOnProgress = true;
      total += result.data.featuredPublicAnimations.edges.length;
      updateProgress(0);
      checkIfDone();
      // Fetch all the
      result.data.featuredPublicAnimations.edges.forEach((edge: any) => {
        fetch(edge.node.lottieUrl)
          .then(() => {
            updateProgress(1);
            checkIfDone();
          })
          .catch(updateFail);
      });
    })
    .catch(updateFail);

  // Preload the assets by each category, so user can search by category offline
  [
    undefined, // All Criteria
    Criteria.GAME,
    Criteria.NATURE,
    Criteria.PEOPLE,
    Criteria.SCIENCE,
    Criteria.SHAPE,
    Criteria.TECH,
  ].forEach((criteria) => {
    client
      .query({
        query: GET_ASSETS,
        variables: {
          criteria,
          before: 0,
          limit: ASSET_PER_PAGE,
        },
      })
      .then((result) => {
        serverAssetsOnProgress = true;
        total += result.data.assets.nodes.length;
        updateProgress(0);
        checkIfDone();
        result.data.assets.nodes.forEach((asset) => {
          fetch(asset.file)
            .then(() => {
              updateProgress(1);
              checkIfDone();
            })
            .catch(updateFail);
        });
      })
      .catch(updateFail);
  });
};
