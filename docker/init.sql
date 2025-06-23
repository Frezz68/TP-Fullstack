-- Initialisation de la base de données
USE fullstack_db;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des posts/articles
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertion de données d'exemple
INSERT INTO users (username, email, password_hash) VALUES
('admin', 'admin@example.com', '$2b$10$example.hash'),
('user1', 'user1@example.com', '$2b$10$example.hash'),
('user2', 'user2@example.com', '$2b$10$example.hash');

INSERT INTO posts (title, content, user_id) VALUES
('Premier post', 'Contenu du premier post...', 1),
('Deuxième post', 'Contenu du deuxième post...', 2),
('Troisième post', 'Contenu du troisième post...', 1); 