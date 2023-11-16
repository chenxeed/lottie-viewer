import { User } from "./entity";
import { Asset } from "../Asset/entity";
import { SyncStatus } from "../SyncStatus/entity";
import {
  AssetResolvers,
  MutationResolvers,
  QueryResolvers,
  SyncStatusResolvers,
} from "../../schema/types";

export const UserSchema = `
extend type Query {
  users: [User]
  user(id: Int!): User!
}

extend type Mutation {
  createUser(name: String!): User!
}

type User {
  id: Int!
  name: String!
  assets: [Asset]!
}
`;

interface UserQueryResolver {
  Query: {
    users: QueryResolvers["users"];
    user: QueryResolvers["user"];
  };
  Asset: {
    user: AssetResolvers["user"];
  };
  SyncStatus: {
    user: SyncStatusResolvers["user"];
  };
}
export const UserQueryResolver = {
  Query: {
    async users() {
      const result = await User.find({
        order: {
          id: "DESC",
        },
      });
      return result;
    },
    async user(_, { id }) {
      const result = await User.findOneBy({
        id,
      });
      return result;
    },
  },
  Asset: {
    async user(parent) {
      const asset = await Asset.findOne({
        where: {
          id: parent.id,
        },
        relations: ["user"],
      });
      return asset.user;
    },
  },
  SyncStatus: {
    async user(parent) {
      const syncStatus = await SyncStatus.findOne({
        where: {
          id: parent.id,
        },
        relations: ["user"],
      });
      return syncStatus.user;
    },
  },
};

interface UserMutationResolver {
  Mutation: {
    createUser: MutationResolvers["createUser"];
  };
}
export const UserMutationResolver = {
  Mutation: {
    async createUser(_, { name }) {
      const user = User.create({
        name,
      });
      await user.save();
      return user;
    },
  },
};
