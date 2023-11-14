import { SyncStatus } from "../SyncStatus/entity";
import { User } from "../User/entity";
import { Asset } from "./entity";

export const AssetSchema = `
extend type Query {
  assets: [Asset]!
  asset(id: Int!): Asset!
}

extend type Mutation {
  createAsset(userId: Int!, title: String!, file: String!): Asset!
}

type Asset {
  id: ID!
  title: String!
  file: String!
  createdAt: Date!
  user: User
}
`;

export const AssetQueryResolver = {
  Query: {
    async assets() {
      const result = await Asset.find({
        order: {
          createdAt: "DESC"
        }
      });
      return result;
    },
    async asset(_, { id }) {
      const result = await Asset.findOneBy({
        id
      });
      return result;
    },
  },
  User: {
    async assets(parent) {
      const result = await Asset.find({
        where: {
          user: {
            id: parent.id,
          },
        }
      })
      return result;
    }
  }
};

export const AssetMutationResolver = {
  Mutation: {
    createAsset: async (_, { userId, title, file }) => {
      const user = await User.findOneBy({ id: userId });
      const asset = Asset.create({
        title,
        file,
        user: user,
      });
      await asset.save();

      // Everytime asset is created, we log the last update to the SyncStatus
      const newStatus = await SyncStatus.save({ user });

      return asset;
    }  
  }
};
