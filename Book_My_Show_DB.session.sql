-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     email VARCHAR(322) UNIQUE NOT NULL,
--     password TEXT NOT NULL
-- )

-- ALTER TABLE seats ADD COLUMN user_id INT REFERENCES users(id);

DELETE FROM seats;
DELETE FROM users;
-- Reset seats
INSERT INTO seats (isbooked) SELECT 0 FROM generate_series(1, 20);