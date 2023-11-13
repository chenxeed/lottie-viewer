import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: "http://192.168.0.114/api/graphql",
    cache: new InMemoryCache(),
  });
;
