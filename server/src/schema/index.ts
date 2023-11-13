import Base from './base';
import { GraphQLSchema, buildSchema } from "graphql";
import { AssetSchema, AssetQueryResolver, AssetMutationResolver } from "../modules/Asset/resolver";
import { UserSchema, UserQueryResolver, UserMutationResolver } from "../modules/User/resolver";
import { IResolvers } from '@graphql-tools/utils';
import { mergeResolvers } from '@graphql-tools/merge';

export function generateSchema (): GraphQLSchema {
  const schemaQuery = [Base, AssetSchema, UserSchema].join('\n');
  return buildSchema(schemaQuery);
}

export function generateResolvers (): IResolvers<any, any> {
  return mergeResolvers([
    AssetQueryResolver,
    AssetMutationResolver,
    UserQueryResolver,
    UserMutationResolver,
  ]);
}