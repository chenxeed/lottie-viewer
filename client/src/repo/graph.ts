import { gql } from "@apollo/client";

export const GET_ASSETS = gql`
query GetAssets {
  assets {
    id
    title
    file
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
mutation CreateAsset($userId: Int!, $title: String!, $file: String!) {
  createAsset(userId: $userId, title: $title, file: $file) {
    id
    title
    file
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
