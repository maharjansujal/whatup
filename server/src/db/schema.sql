CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        password_hash VARCHAR(100) NOT NULL,
        image VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users (id),
        receiver_id INTEGER NOT NULL REFERENCES users (id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW (),
        updated_at TIMESTAMP
    );