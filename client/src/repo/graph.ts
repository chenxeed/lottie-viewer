import { gql } from "@apollo/client";

export const GET_ASSETS = gql`
  query Assets($before: Int, $limit: Int, $after: Int, $criteria: String) {
    assets(before: $before, limit: $limit, after: $after, criteria: $criteria) {
      nodes {
        createdAt
        criteria
        file
        id
        title
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const GET_LAST_SYNC_STATUS = gql`
  query LastSyncStatus {
    lastSyncStatus {
      id
      lastUpdate
      user {
        name
      }
    }
  }
`;

export const CREATE_ASSET = gql`
  mutation CreateAsset(
    $userId: Int!
    $title: String!
    $file: String!
    $criteria: String!
  ) {
    createAsset(
      userId: $userId
      title: $title
      file: $file
      criteria: $criteria
    ) {
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

export const FeaturedPublicAnimations = gql`
  query FeaturedPublicAnimations($after: String) {
    featuredPublicAnimations(after: $after) {
      edges {
        node {
          id
          slug
          jsonUrl
          name
          imageUrl
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
