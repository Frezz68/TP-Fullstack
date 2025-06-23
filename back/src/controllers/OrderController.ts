import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { Product } from "../entity/Product";
import { AuthRequest } from "../middleware/auth";

export class OrderController {
  static async createOrder(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Les articles sont requis" });
      }

      const orderRepository = AppDataSource.getRepository(Order);
      const orderItemRepository = AppDataSource.getRepository(OrderItem);
      const productRepository = AppDataSource.getRepository(Product);

      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await productRepository.findOne({ where: { id: item.productId } });
        
        if (!product) {
          return res.status(404).json({ message: `Produit avec ID ${item.productId} non trouvé` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Stock insuffisant pour ${product.name}. Disponible: ${product.stock}, Demandé: ${item.quantity}` 
          });
        }

        totalAmount += product.price * item.quantity;
        orderItems.push({
          product,
          quantity: item.quantity,
          price: product.price
        });
      }

      const order = orderRepository.create({
        user_id: req.user.id,
        total_amount: totalAmount,
        status: "pending"
      });

      await orderRepository.save(order);

      for (const item of orderItems) {
        const orderItem = orderItemRepository.create({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.price
        });

        await orderItemRepository.save(orderItem);

        item.product.stock -= item.quantity;
        await productRepository.save(item.product);
      }

      const completeOrder = await orderRepository.findOne({
        where: { id: order.id },
        relations: ["orderItems", "orderItems.product"]
      });

      return res.status(201).json(completeOrder);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la création de la commande" });
    }
  }

  static async getUserOrders(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      const orderRepository = AppDataSource.getRepository(Order);
      const orders = await orderRepository.find({
        where: { user_id: req.user.id },
        relations: ["orderItems", "orderItems.product"],
        order: { createdAt: "DESC" }
      });

      return res.json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
    }
  }

  static async getOrderById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      const id = parseInt(req.params.id);
      
      const orderRepository = AppDataSource.getRepository(Order);
      const order = await orderRepository.findOne({
        where: { id, user_id: req.user.id },
        relations: ["orderItems", "orderItems.product"]
      });
      
      if (!order) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }
      
      return res.json(order);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la récupération de la commande" });
    }
  }
}
