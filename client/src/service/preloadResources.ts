import { lottieClient } from "../repo/lottie-graphql/client";
import { FEATURED_PUBLIC_ANIMATIONS } from "../repo/lottie-graphql/graph";

/**
 * Preload the lottie public animations library for offline use.
 * Mainly focusing on the source URL
 */
export const preloadResources = (): void => {
  lottieClient
    .query({
      query: FEATURED_PUBLIC_ANIMATIONS,
    })
    .then((result) => {
      result.data.featuredPublicAnimations.edges.forEach((edge: any) => {
        fetch(edge.node.lottieUrl);
      });
    });
};
