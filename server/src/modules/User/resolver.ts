import { Asset, User } from "./entity";

export const UserSchema = `
extend type Query {
  users: [User]
  user(id: Int!): User!
}

extend type Mutation {
  createUser(name: String!): User!
}

type User {
  id: ID!
  name: String!
  assets: [Asset]!
}
`;

export const UserQueryResolver = {
  Query: {
    async users() {
      const result = await User.find({
        order: {
          id: "DESC"
        }
      });
      return result;
    },
    async user(_, { id }) {
      const result = await User.findOneBy({
        id
      });
      return result;
    },
  },
  Asset: {
    async user(parent) {
      const asset = await Asset.findOneBy({ id: parent.id });
      return asset.user;
    }  
  }
};

export const UserAssetResolver = {
}

export const UserMutationResolver = {
  Mutation: {
    async createUser(_, { name }) {
      const user = User.create({
        name
      });
      await user.save();
      return user;
    }  
  }
};