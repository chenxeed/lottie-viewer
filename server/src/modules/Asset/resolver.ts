import { User } from "../User/entity";
import { Asset } from "./entity";

export const AssetSchema = `
extend type Query {
  assets: [Asset]
  asset(id: Int!): Asset!
}

extend type Mutation {
  createAsset(userId: Int!, title: String!, description: String): Asset!
}

type Asset {
  id: ID!
  title: String!
  file: String!
  user: User
}
`;

export const AssetQueryResolver = {
  Query: {
    async assets() {
      const result = await Asset.find({
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
      return Asset;
    }  
  }
};