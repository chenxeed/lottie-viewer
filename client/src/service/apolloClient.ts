import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
});
export const lottieClient = new ApolloClient({
  uri: "https://graphql.lottiefiles.com/2022-08",
  cache: new InMemoryCache(),
});
