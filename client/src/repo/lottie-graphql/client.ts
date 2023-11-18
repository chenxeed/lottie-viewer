import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Query } from "./__generated__/graphql";

export const lottieClient = new ApolloClient({
  uri: "https://graphql.lottiefiles.com/2022-08",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          featuredPublicAnimations: {
            keyArgs: false,
            merge(
              existing: Query["featuredPublicAnimations"] = {
                pageInfo: {
                  hasNextPage: false,
                  endCursor: "",
                  hasPreviousPage: false,
                  __typename: "PageInfo",
                },
                edges: [],
                totalCount: 0,
              },
              incoming: Query["featuredPublicAnimations"],
            ) {
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
