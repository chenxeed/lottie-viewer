
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost/api/graphql", // Just to be generated on local
  generates: {
    "src/schema/types.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    }
  }
};

export default config;
