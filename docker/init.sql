SET NAMES 'utf8mb4';

-- Initialisation de la base de données
USE fullstack_db;

-- Table utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table produits
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table commandes
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table liaison commande-produit
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insertion données d'exemple
INSERT INTO users (firstname, lastname, email, password, address, phone) VALUES
('Admin', 'User', 'admin@example.com', '$2b$10$gUDV4SXx9HfblRy9YeuQwe8uaIw5KnVu3ezUbApoGI7LhQCI3rN0G', 'Champs Élysée', '+33612345678');

-- Insertion produits d'exemple
INSERT INTO products (name, description, price, image_url, stock) VALUES
('Samsul ', 'Un smartphone puissant avec appareil photo haute résolution', 599.99, 'https://picsum.photos/id/1/500/500', 50),
('Laptop Asus', 'Ordinateur portable ultraléger avec écran haute définition', 1299.99, 'https://picsum.photos/id/2/500/500', 30),
('Casque Audio', 'Casque sans fil avec réduction de bruit active', 199.99, 'https://picsum.photos/id/3/500/500', 100),
('Montre Connectée', 'Montre intelligente avec suivi d\'activité et notifications', 149.99, 'https://picsum.photos/id/4/500/500', 75),
('Enceinte Blue tooth', 'Enceinte portable avec des dents bleu et un son immersif et batterie longue durée', 89.99, 'https://picsum.photos/id/5/500/500', 60),
('Tablette Ultra', 'Tablette tactile avec écran 10 pouces et processeur rapide', 349.99, 'https://picsum.photos/id/6/500/500', 40),
('Appareil Photo Pro', 'Appareil photo reflex avec objectif haute qualité', 799.99, 'https://picsum.photos/id/7/500/500', 25),
('Clavier Gaming', 'Clavier mécanique rétroéclairé pour gamers', 129.99, 'https://picsum.photos/id/8/500/500', 80),
('Souris Hair gonomique', 'Souris ergonomique sans fil pour un confort optimal', 49.99, 'https://picsum.photos/id/9/500/500', 120),
('Écouteurs Sport', 'Écouteurs sans fil résistants à l\'eau pour le sport', 79.99, 'https://picsum.photos/id/10/500/500', 90);

INSERT INTO orders (user_id, total_amount, status) VALUES
(2, 849.98, 'completed'),
(3, 429.98, 'completed'),
(2, 1299.99, 'pending');

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 3, 1, 199.99),
(1, 5, 1, 89.99),
(1, 9, 2, 49.99),
(1, 10, 1, 79.99),
(2, 4, 1, 149.99),
(2, 8, 1, 129.99),
(2, 9, 3, 49.99),
(3, 2, 1, 1299.99);