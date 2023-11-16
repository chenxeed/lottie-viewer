import { User } from "./entity";
import { Asset } from "../Asset/entity";
import { SyncStatus } from "../SyncStatus/entity";

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
