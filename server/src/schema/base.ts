/**
 * The Query and Mutation type here will be distributed across all modules, to be extended.
 */
const Base = `
type Query
type Mutation

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: Int
  endCursor: Int
}

scalar Url
scalar Date
`;

export default Base;
