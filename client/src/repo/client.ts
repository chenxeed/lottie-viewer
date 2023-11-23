import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { Query } from "./server-graphql/__generated__/graphql";
import { Query as LottieQuery } from "./lottie-graphql/__generated__/graphql";

const serverLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "same-origin",
});

const lottieLink = new HttpLink({
  uri: "https://graphql.lottiefiles.com/2022-08",
  credentials: "same-origin",
});

export const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "lottie",
    // the string "third-party" can be anything you want,
    // we will use it in a bit
    lottieLink, // <= apollo will send to this if clientName is "third-party"
    serverLink, // <= otherwise will send to this
  ),
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
          featuredPublicAnimations: {
            keyArgs: false,
            merge(
              existing: LottieQuery["featuredPublicAnimations"] = {
                pageInfo: {
                  hasNextPage: false,
                  endCursor: "",
                  hasPreviousPage: false,
                  __typename: "PageInfo",
                },
                edges: [],
                totalCount: 0,
              },
              incoming: LottieQuery["featuredPublicAnimations"],
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
    } as any,
  }),
});
