import { CodegenConfig } from "@graphql-codegen/cli";

/**
 * This is the configuration for GraphQL Code Generator.
 * It's used to generate the types for the GraphQL queries and mutations.
 * Currently it needs manual modification because the codebase currently has two GraphQL client,
 * one for the server and one for the lottie GraphQL API.
 *
 * If you want to use it, please modify the config accordingly based on which schema you want to generate.
 */
const config: CodegenConfig = {
  schema: "http://localhost/api/graphql",
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ["src/repo/server-graphql/**/*.{ts,tsx}"],
  generates: {
    "./src/repo/server-graphql/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
