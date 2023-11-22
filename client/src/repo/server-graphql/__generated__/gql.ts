/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query Assets($before: Int, $limit: Int, $after: Int, $criteria: String) {\n    assets(before: $before, limit: $limit, after: $after, criteria: $criteria) {\n      nodes {\n        createdAt\n        criteria\n        file\n        id\n        title\n        user {\n          name\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n": types.AssetsDocument,
    "\n  query LastSyncStatus {\n    lastSyncStatus {\n      id\n      lastUpdate\n      user {\n        name\n      }\n    }\n  }\n": types.LastSyncStatusDocument,
    "\n  mutation CreateAsset(\n    $userId: Int!\n    $title: String!\n    $file: String!\n    $criteria: String!\n  ) {\n    createAsset(\n      userId: $userId\n      title: $title\n      file: $file\n      criteria: $criteria\n    ) {\n      id\n      title\n      file\n      criteria\n      createdAt\n      user {\n        id\n        name\n      }\n    }\n  }\n": types.CreateAssetDocument,
    "\n  mutation CreateUser($name: String!) {\n    createUser(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateUserDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Assets($before: Int, $limit: Int, $after: Int, $criteria: String) {\n    assets(before: $before, limit: $limit, after: $after, criteria: $criteria) {\n      nodes {\n        createdAt\n        criteria\n        file\n        id\n        title\n        user {\n          name\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n"): (typeof documents)["\n  query Assets($before: Int, $limit: Int, $after: Int, $criteria: String) {\n    assets(before: $before, limit: $limit, after: $after, criteria: $criteria) {\n      nodes {\n        createdAt\n        criteria\n        file\n        id\n        title\n        user {\n          name\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LastSyncStatus {\n    lastSyncStatus {\n      id\n      lastUpdate\n      user {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query LastSyncStatus {\n    lastSyncStatus {\n      id\n      lastUpdate\n      user {\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateAsset(\n    $userId: Int!\n    $title: String!\n    $file: String!\n    $criteria: String!\n  ) {\n    createAsset(\n      userId: $userId\n      title: $title\n      file: $file\n      criteria: $criteria\n    ) {\n      id\n      title\n      file\n      criteria\n      createdAt\n      user {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAsset(\n    $userId: Int!\n    $title: String!\n    $file: String!\n    $criteria: String!\n  ) {\n    createAsset(\n      userId: $userId\n      title: $title\n      file: $file\n      criteria: $criteria\n    ) {\n      id\n      title\n      file\n      criteria\n      createdAt\n      user {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateUser($name: String!) {\n    createUser(name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($name: String!) {\n    createUser(name: $name) {\n      id\n      name\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;