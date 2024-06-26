import type {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: "./src/types/common/data.graphql",
    generates: {
        "src/types/graphql.ts": {
            plugins: ["typescript", "typescript-resolvers"]
        },
    }
};

export default config;
