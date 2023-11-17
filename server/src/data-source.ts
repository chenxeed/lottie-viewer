import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Asset } from "./modules/Asset/entity";
import { User } from "./modules/User/entity";
import { SyncStatus } from "./modules/SyncStatus/entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: false,
  logging: true,
  migrationsRun: true,
  migrationsTableName: "migrations",
  entities: [Asset, User, SyncStatus],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
