import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Query } from "./__generated__/graphql";

export const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache({
    // TODO: Type the typePolicies and incoming data properly
    typePolicies: {
      Query: {
        fields: {
          assets: {
            keyArgs: ["criteria"],
            merge(
              existing: Query["assets"] = {
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
                nodes: [],
              },
              incoming: Query["assets"],
              params: { args: { before: number; limit: number } },
            ) {
              // Handle the merging strategy for the infinite scroll pagination of assets here.
              // It needs to handle two scenarios:
              // - When the user is scrolling down, the new data should be appended to the existing data.
              // - When the user switches the criteria, the new data should replace the existing data.

              // `before === 0` indicates the user loads the first page of the data.
              // This is consistent because currently user can't jump to a specific page,
              // so they must always beign with the first page.
              if (params.args.before === 0) {
                return incoming;
              }

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
