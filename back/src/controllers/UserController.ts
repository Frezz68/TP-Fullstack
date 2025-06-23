import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/auth";

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const { firstname, lastname, email, password, address, phone } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepository.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        address,
        phone
      });

      await userRepository.save(user);

      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "votre_secret_tres_securise",
        { expiresIn: "24h" }
      );

      const { password: _, ...userWithoutPassword } = user;
      return res.json({
        ...userWithoutPassword,
        token
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ 
        where: { id: req.user.id },
        relations: ["orders"]
      });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la récupération du profil" });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      const { firstname, lastname, address, phone } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      user.firstname = firstname || user.firstname;
      user.lastname = lastname || user.lastname;
      user.address = address || user.address;
      user.phone = phone || user.phone;

      await userRepository.save(user);

      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
    }
  }
}
