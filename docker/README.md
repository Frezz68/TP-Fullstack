# Configuration Docker - Base de données MySQL

## Services inclus

- **MySQL 8.0** : Base de données principale
- **phpMyAdmin** : Interface web pour gérer la base de données

## Configuration

### Variables d'environnement MySQL
- **Root Password** : `rootpassword`
- **Database** : `fullstack_db`
- **User** : `user`
- **Password** : `password`

### Ports
- **MySQL** : `3306`
- **phpMyAdmin** : `8080`

## Utilisation

### Démarrer les services
```bash
cd docker
docker-compose up -d
```

### Arrêter les services
```bash
docker-compose down
```

### Arrêter et supprimer les volumes (attention : supprime les données)
```bash
docker-compose down -v
```

### Voir les logs
```bash
docker-compose logs -f mysql
```

## Accès

### Base de données MySQL
- **Host** : `localhost` ou `127.0.0.1`
- **Port** : `3306`
- **Database** : `fullstack_db`
- **Username** : `user` ou `root`
- **Password** : `password` ou `rootpassword`

### phpMyAdmin
- **URL** : `http://localhost:8080`
- **Username** : `root`
- **Password** : `rootpassword`

## Structure de la base de données

### Tables créées automatiquement
- `users` : Table des utilisateurs
- `posts` : Table des posts/articles

### Données d'exemple
- 3 utilisateurs de test
- 3 posts de test

## Connexion depuis l'application

### Variables de connexion pour le backend
```javascript
const dbConfig = {
  host: 'localhost',
  port: 3306,
  database: 'fullstack_db',
  user: 'user',
  password: 'password'
};
``` 