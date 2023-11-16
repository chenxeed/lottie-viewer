import { FeaturedPublicAnimations } from "../repo/graph";
import { lottieClient } from "./apolloClient";
import { fetchFileContentFromPublicURL } from "./fileBucket";

export const preloadResources = (): void => {
  // Preload the lottie public animations library, mainly on the JSON and image thumbnail
  lottieClient
    .query({
      query: FeaturedPublicAnimations,
    })
    .then((result) => {
      result.data.featuredPublicAnimations.edges.forEach((edge: any) => {
        fetchFileContentFromPublicURL(edge.node.jsonUrl);
        const img = new Image();
        img.src = edge.node.imageUrl;
      });
    });
};
