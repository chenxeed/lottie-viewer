import express, { type Router, type Express } from "express";
import dotenv from "dotenv";

export const getRouter = (app: Express): Router => {
  const env = dotenv.config();
  const apiPrefix = env.parsed?.API_PREFIX || "/";
  const router = express.Router();

  router.get("/", (_req, res) => {
    res.json({
      data: "Welcome! This is the API server for the app",
    });
  });

  app.use(apiPrefix, router);

  return router;
};
