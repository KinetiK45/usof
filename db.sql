DROP DATABASE IF EXISTS usof_lubiviy;

CREATE DATABASE IF NOT EXISTS usof_lubiviy;
CREATE USER IF NOT EXISTS 'dljubyvyj'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON usof_lubiviy.* TO 'dljubyvyj'@'localhost';

use usof_lubiviy;

CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nickname VARCHAR(20) NOT NULL UNIQUE,
    photo VARCHAR(256) DEFAULT 'default.png',
    status VARCHAR(20),
    post_rating INT NOT NULL DEFAULT 0,
    comment_rating INT NOT NULL DEFAULT 0,
    role ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS categories(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(256) NOT NULL UNIQUE,
    description VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS posts(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    creator_id INT,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_edited TIMESTAMP DEFAULT null,
    is_active bool NOT NULL DEFAULT TRUE,
    like_total INT NOT NULL DEFAULT 0,
    dislike_total INT NOT NULL DEFAULT 0,
    FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    creator_id INT NOT NULL,
    content TEXT NOT NULL,
    parent_post_id INT NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	date_edited TIMESTAMP DEFAULT null,
    is_active bool NOT NULL DEFAULT TRUE,
	like_total INT NOT NULL DEFAULT 0,
	dislike_total INT NOT NULL DEFAULT 0,
    FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(parent_post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_categories(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_likes(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    value INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
	UNIQUE KEY unique_post_user_like (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS comment_likes(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	comment_id INT NOT NULL,
    user_id INT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    value INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
	UNIQUE KEY unique_comment_user_like (comment_id, user_id)
);

-- тригеры

DELIMITER //

CREATE TRIGGER before_update_posts
BEFORE UPDATE ON posts
FOR EACH ROW
BEGIN
    IF NEW.title != OLD.title OR NEW.content != OLD.content THEN
        SET NEW.date_edited = CURRENT_TIMESTAMP;
    END IF;
END;

//

CREATE TRIGGER before_update_comments
BEFORE UPDATE ON comments
FOR EACH ROW
BEGIN
    IF NEW.content != OLD.content THEN
        SET NEW.date_edited = CURRENT_TIMESTAMP;
    END IF;
END;

//

CREATE TRIGGER auto_generate_username
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    DECLARE next_number INT;
    SET next_number = (SELECT IFNULL(MAX(SUBSTRING(nickname, 5) + 1), 1) FROM users);
    SET NEW.nickname = CONCAT('user', next_number);
    WHILE (SELECT COUNT(*) FROM users WHERE nickname = NEW.nickname) > 0 DO
        SET next_number = next_number + 1;
        SET NEW.nickname = CONCAT('user', next_number);
    END WHILE;
END;

//

CREATE TRIGGER update_rating_on_like_insert
AFTER INSERT ON post_likes
FOR EACH ROW
BEGIN
    UPDATE users
	SET post_rating = post_rating + NEW.value
    WHERE id = (
        SELECT creator_id
        FROM posts
        WHERE id = NEW.post_id
    );

    UPDATE posts
    SET like_total = like_total + CASE WHEN NEW.value = 1 THEN 1 ELSE 0 END,
        dislike_total = dislike_total + CASE WHEN NEW.value = -1 THEN 1 ELSE 0 END
    WHERE id = NEW.post_id;
END;


//

CREATE TRIGGER update_user_rating_on_comment_like_insert
AFTER INSERT ON comment_likes
FOR EACH ROW
BEGIN
        UPDATE users
        SET comment_rating = comment_rating + NEW.value
        WHERE id = (
            SELECT creator_id
            FROM comments
            WHERE id = NEW.comment_id
        );

        UPDATE comments
        SET like_total = like_total + CASE WHEN NEW.value = 1 THEN 1 ELSE 0 END,
			dislike_total = dislike_total + CASE WHEN NEW.value = -1 THEN 1 ELSE 0 END
        WHERE id = NEW.comment_id;
END;

//

CREATE TRIGGER update_user_rating_on_comment_like_delete
AFTER DELETE ON comment_likes
FOR EACH ROW
BEGIN
    UPDATE users
    SET comment_rating = comment_rating - OLD.value
    WHERE id = (
        SELECT creator_id
        FROM comments
        WHERE id = OLD.comment_id
    );

    UPDATE comments
	SET like_total = like_total - CASE WHEN OLD.value = 1 THEN 1 ELSE 0 END,
        dislike_total = dislike_total - CASE WHEN OLD.value = -1 THEN 1 ELSE 0 END
	WHERE id = OLD.comment_id;
END;

//

CREATE TRIGGER update_rating_on_like_delete
AFTER DELETE ON post_likes
FOR EACH ROW
BEGIN
    UPDATE users
    SET post_rating = post_rating - OLD.value
    WHERE id = (
        SELECT creator_id
        FROM posts
        WHERE id = OLD.post_id
    );

    UPDATE posts
    SET like_total = like_total - CASE WHEN OLD.value = 1 THEN 1 ELSE 0 END,
        dislike_total = dislike_total - CASE WHEN OLD.value = -1 THEN 1 ELSE 0 END
    WHERE id = OLD.post_id;
END;

//
DELIMITER ;