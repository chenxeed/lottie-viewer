import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache({
    // TODO: Type the typePolicies and incoming data properly
    typePolicies: {
      Query: {
        fields: {
          assets: {
            keyArgs: false,
            merge(existing = { pageInfo: {}, nodes: [] }, incoming: any) {
              const mergedData = {
                pageInfo: incoming.pageInfo,
                nodes: [...existing?.nodes, ...incoming.nodes],
              };
              return mergedData;
            },
          },
        },
      },
    } as any,
  }),
});
export const lottieClient = new ApolloClient({
  uri: "https://graphql.lottiefiles.com/2022-08",
  cache: new InMemoryCache(),
});
