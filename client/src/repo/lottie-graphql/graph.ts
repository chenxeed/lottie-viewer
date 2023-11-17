import { gql } from "./__generated__";

export const FEATURED_PUBLIC_ANIMATIONS = gql(`
  query FeaturedPublicAnimations($after: String) {
    featuredPublicAnimations(after: $after) {
      edges {
        node {
          id
          slug
          lottieUrl
          name
          imageUrl
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);
