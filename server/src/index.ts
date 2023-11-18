import { AppDataSource } from "./data-source";
import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { getRouter } from "./routes";
import { generateResolvers, generateSchema } from "./schema";
import { ApolloServer } from "apollo-server-express";

AppDataSource.initialize()
  .then(async () => {
    const port = process.env.API_PORT || 3000;
    const prefix = process.env.API_PREFIX || "/api";

    const app = express();
    app.use(
      helmet({
        contentSecurityPolicy:
          process.env.NODE_ENV === "production" ? undefined : false,
      })
    );
    app.use(morgan("combined"));
    app.use(bodyParser.json());

    // Initialize GraphQL server
    const server = new ApolloServer({
      typeDefs: generateSchema(),
      resolvers: generateResolvers(),
    });

    await server.start();
    server.applyMiddleware({
      app,
      path: `${prefix}/graphql`,
    });

    getRouter(app);

    app.listen(port, () => {
      console.log(`Server running at PREFIX ${prefix} and PORT ${port}`);
    });
  })
  .catch((error) => console.log(error));
