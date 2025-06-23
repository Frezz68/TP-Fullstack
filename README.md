# TP Full Stack - Application E-Commerce

Projet d'application e-commerce développé avec Angular 18 et Express TypeScript avec TypeORM.

## Technologies utilisées

- **Frontend**: Angular 19
- **Backend**: Express avec TypeScript et TypeORM
- **Base de données**: MySQL
- **Docker**: Pour la virtualisation de la base de données

## Prérequis

- Node.js v22+ LTS
- Docker et Docker Compose
- npm

## Installation et démarrage

1. Cloner le dépôt
```bash
git clone https://github.com/Frezz68/TP-Fullstack
cd TP-fullstack
```

2. configurer son .env
```bash
cp .env.example .env
```

3. Lancer Docker pour la base de données MySQL depuis le repertoire `docker`
```bash
docker-compose up -d
```

4. Lancer l'application en mode développement back
```bash
npm install
npm run dev
```
5. Lancer l'application en mode développement front
```bash
npm install
npm run start
```
Ces commandes vont :
- Démarrer la base de données MySQL avec Docker
- Installer les dépendances du backend et démarrer le serveur Express
- Installer les dépendances du frontend et démarrer le serveur de développement Angular

## Accès à l'application

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- PHPMyAdmin: http://localhost:8080 (user: root, password: rootpassword)

## Fonctionnalités

- Liste des produits
- Détail des produits
- Gestion du panier
- Processus de commande
- Profil utilisateur
- Historique des commandes

## Tests
- Utilisateur de base : admin@example.com
- Mot de passe : azerty
