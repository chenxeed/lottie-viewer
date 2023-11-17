import { FeaturedPublicAnimations } from "../repo/graph";
import { lottieClient } from "./apolloClient";

export const preloadResources = (): void => {
  // Preload the lottie public animations library, mainly on the source URL and image thumbnail
  lottieClient
    .query({
      query: FeaturedPublicAnimations,
    })
    .then((result) => {
      result.data.featuredPublicAnimations.edges.forEach((edge: any) => {
        fetch(edge.node.lottieUrl);
        const img = new Image();
        img.src = edge.node.imageUrl;
      });
    });
};
