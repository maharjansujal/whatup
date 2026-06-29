CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'seen');

CREATE TYPE availability_status AS ENUM ('idle', 'away', 'do-not-disturb');

CREATE TYPE status_mode AS ENUM ('manual', 'auto');

CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        password_hash VARCHAR(100) NOT NULL,
        image VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW (),
        updated_at TIMESTAMP,
        last_seen_at TIMESTAMP,
        status_mode status_mode DEFAULT 'auto',
        custom_status availability_status DEFAULT NULL
    );

CREATE TABLE
    messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users (id),
        receiver_id INTEGER NOT NULL REFERENCES users (id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW (),
        updated_at TIMESTAMP,
        status message_status DEFAULT 'sent'
    );