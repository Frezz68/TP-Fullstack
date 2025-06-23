import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Product } from "../entity/Product";

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const products = await productRepository.find();
      return res.json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la récupération des produits" });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOne({ where: { id } });
      
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      
      return res.json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la récupération du produit" });
    }
  }
}
