import { lottieClient } from "../repo/lottie-graphql/client";
import { FEATURED_PUBLIC_ANIMATIONS } from "../repo/lottie-graphql/graph";

export const preloadResources = (): void => {
  // Preload the lottie public animations library, mainly on the source URL and image thumbnail
  lottieClient
    .query({
      query: FEATURED_PUBLIC_ANIMATIONS,
    })
    .then((result) => {
      result.data.featuredPublicAnimations.edges.forEach((edge: any) => {
        fetch(edge.node.lottieUrl);
        const img = new Image();
        img.src = edge.node.imageUrl;
      });
    });
};
