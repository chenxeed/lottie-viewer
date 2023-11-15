import { gql } from "@apollo/client";

export const GET_ASSETS = gql`
query GetAssets($after: Int, $criteria: String) {
  assets(after: $after, criteria: $criteria) {
    id
    title
    file
    criteria
    createdAt
  }
}`

export const GET_LAST_SYNC_STATUS = gql`
query LastSyncStatus {
  lastSyncStatus {
    id
    lastUpdate
    user {
      name
    }
  }
}`

export const CREATE_ASSET = gql`
mutation CreateAsset($userId: Int!, $title: String!, $file: String!, $criteria: String!) {
  createAsset(userId: $userId, title: $title, file: $file, criteria: $criteria) {
    id
    title
    file
    criteria
    createdAt
  }
}
`;

export const CREATE_USER = gql`
mutation CreateUser($name: String!) {
  createUser(name: $name) {
    id
    name
  }
}
`;
