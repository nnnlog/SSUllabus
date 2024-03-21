import {buildASTSchema, GraphQLScalarType, GraphQLEnumType} from 'graphql';
import 'graphql-import-node';
import {makeExecutableSchema} from '@graphql-tools/schema'

import schema from "./data.graphql";

// export default buildASTSchema(schema);
export default makeExecutableSchema({
    typeDefs: buildASTSchema(schema),
});
