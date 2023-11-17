import { ApolloClient, InMemoryCache } from "@apollo/client";

export const lottieClient = new ApolloClient({
  uri: "https://graphql.lottiefiles.com/2022-08",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          featuredPublicAnimations: {
            keyArgs: false,
            merge(existing = { pageInfo: {}, edges: [] }, incoming) {
              const mergedData = {
                pageInfo: incoming.pageInfo,
                edges: [...existing?.edges, ...incoming.edges],
              };
              return mergedData;
            },
          },
        },
      },
    },
  }),
});
