import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entity/User";
import { Product } from "../entity/Product";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "fullstack_db",
  synchronize: false,
  logging: true,
  entities: [User, Product, Order, OrderItem],
  migrations: [],
  subscribers: [],
});
