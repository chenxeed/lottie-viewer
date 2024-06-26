import express, { type Router, type Express } from "express";
import { upload, uploadPath } from "../middlewares/multer";

export const getRouter = (app: Express): Router => {
  const apiPrefix = process.env.API_PREFIX || "/";
  const router = express.Router();

  app.use("/bucket/uploads/", express.static(uploadPath));

  router.post("/upload", upload.single("file"), (_req, res) => {
    res.json({
      data: _req.file,
    });
  });

  router.get("/", (_req, res) => {
    res.json({
      data: "Welcome! This is the Bucket server for the app",
    });
  });

  app.use(apiPrefix, router);

  return router;
};
