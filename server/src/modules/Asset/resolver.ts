import { MutationResolvers, QueryResolvers, UserResolvers } from "../../schema/types";
import { SyncStatus } from "../SyncStatus/entity";
import { User } from "../User/entity";
import { Asset } from "./entity";
import { MoreThan } from 'typeorm';

export const AssetSchema = `
extend type Query {
  assets(after: Int, criteria: String): [Asset]!
  asset(id: Int!): Asset!
}

extend type Mutation {
  createAsset(userId: Int!, title: String!, file: String!, criteria: String!): Asset!
}

type Asset {
  id: Int!
  title: String!
  file: String!
  criteria: String
  createdAt: Date!
  user: User
}
`;

type AssetQueryResolver = {
  Query: {
    assets: QueryResolvers['assets'],
    asset: QueryResolvers['asset'],
  },
  User: {
    assets: UserResolvers['assets'],
  }
}

export const AssetQueryResolver: AssetQueryResolver = {
  Query: {
    async assets(_, { after = 0, criteria = "" }) {
      const result = await Asset.find({
        where: {
          ...( criteria ? { criteria } : {}),
          id: MoreThan(after),
        },
        order: {
          id: "DESC"
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

type AssetMutationResolver = {
  Mutation: {
    createAsset: MutationResolvers['createAsset'],
  }
}

export const AssetMutationResolver: AssetMutationResolver = {
  Mutation: {
    createAsset: async (_, { userId, title, file, criteria }) => {
      const user = await User.findOneBy({ id: userId });
      const asset = Asset.create({
        title,
        file,
        criteria,
        user: user,
      });
      await asset.save();

      // Everytime asset is created, we log the last update to the SyncStatus
      const newStatus = await SyncStatus.save({ user });

      return asset;
    }  
  }
};
