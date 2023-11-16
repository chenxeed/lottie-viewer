import {
  MutationResolvers,
  QueryResolvers,
  UserResolvers,
} from "../../schema/types";
import { SyncStatus } from "../SyncStatus/entity";
import { User } from "../User/entity";
import { Asset } from "./entity";
import { LessThan, MoreThan } from "typeorm";

export const AssetSchema = `
extend type Query {
  assets(after: Int, before: Int, limit: Int, criteria: String): PaginatedAsset!
  asset(id: Int!): Asset!
}

extend type Mutation {
  createAsset(userId: Int!, title: String!, file: String!, criteria: String!): Asset!
}

type PaginatedAsset {
  nodes: [Asset]!
  pageInfo: PageInfo!
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
    assets: QueryResolvers["assets"];
    asset: QueryResolvers["asset"];
  };
  User: {
    assets: UserResolvers["assets"];
  };
};

export const AssetQueryResolver: AssetQueryResolver = {
  Query: {
    async assets(
      _,
      { after = 0, before = 0, limit = undefined, criteria = "" }
    ) {
      if (after > 0 && before > 0) {
        throw new Error("Only one of after or before is allowed");
      }
      const where = {
        ...(criteria ? { criteria } : {}),
        id: before ? LessThan(before) : MoreThan(after),
      };
      const result = await Asset.find({
        where,
        order: {
          id: "DESC",
        },
        // Get 1 more to know if there is a next page
        ...(limit !== undefined ? { take: limit + 1 } : {}),
      });
      const nodes = result.length > limit ? result.slice(0, -1) : result;
      const startCursor = nodes[0]?.id;
      const endCursor = nodes[nodes.length - 1]?.id;
      const isForwardPagination = after > 0;
      const isBackwardPagination = before > 0;
      const hasNextPage = isForwardPagination
        ? limit !== undefined && result.length > limit
        : (await Asset.count({
            where: { ...where, id: MoreThan(startCursor) },
          })) > 0;
      const hasPreviousPage = isBackwardPagination
        ? limit !== undefined && result.length > limit
        : (await Asset.count({
            where: { ...where, id: LessThan(endCursor) },
          })) > 0;
      return {
        nodes,
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor,
          endCursor,
        },
      };
    },
    async asset(_, { id }) {
      const result = await Asset.findOneBy({
        id,
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
        },
      });
      return result;
    },
  },
};

type AssetMutationResolver = {
  Mutation: {
    createAsset: MutationResolvers["createAsset"];
  };
};

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
    },
  },
};
