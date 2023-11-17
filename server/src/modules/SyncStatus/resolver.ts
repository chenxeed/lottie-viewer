import { SyncStatus } from "./entity";

export const SyncStatusSchema = `
extend type Query {
  lastSyncStatus: [SyncStatus!]!
}

type SyncStatus {
  id: Int!
  lastUpdate: Date!
  user: User!
}
`;

export const SyncStatusQueryResolver = {
  Query: {
    async lastSyncStatus() {
      const result = await SyncStatus.find({
        order: {
          id: "DESC",
        },
        take: 1,
      });
      return result;
    },
  },
};
