CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE
    users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        username TEXT UNIQUE NOT NULL,
        display_name TEXT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        avatar_public_id TEXT,
        bio TEXT,
        last_seen_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        deleted_at TIMESTAMPTZ
    );

CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_username ON users (username);

CREATE INDEX idx_users_last_seen_at ON users (last_seen_at);

CREATE TYPE conversation_type AS ENUM ('group', 'direct');

CREATE TYPE conversation_role AS ENUM ('owner', 'admin', 'member');

CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system');

CREATE TYPE conversation_request_status AS ENUM ('pending', 'accepted', 'declined', 'cancelled');

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type conversation_type NOT NULL,
    name TEXT,
    description TEXT,
    image_url TEXT,
    created_by_user_id UUID NOT NULL REFERENCES users(id),

    -- Add FK later to avoid circular dependency
    last_message_id UUID,
    last_message_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_conversations_created_by
ON conversations(created_by_user_id);

CREATE INDEX idx_conversations_last_message_at
ON conversations(last_message_at);


-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL
        REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    type message_type NOT NULL,
    content TEXT,
    reply_to_message_id UUID REFERENCES messages(id),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation_created
ON messages(conversation_id, created_at DESC);

CREATE INDEX idx_messages_sender_id
ON messages(sender_id);

CREATE INDEX idx_messages_reply_to
ON messages(reply_to_message_id);


ALTER TABLE conversations
ADD CONSTRAINT fk_conversations_last_message
FOREIGN KEY (last_message_id)
REFERENCES messages(id);

CREATE TABLE
    conversation_invites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        conversation_id UUID NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
        code TEXT UNIQUE NOT NULL,
        created_by_user_id UUID NOT NULL REFERENCES users (id),
        expires_at TIMESTAMPTZ,
        max_uses INT,
        used_count INT NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

CREATE INDEX idx_invites_conversation_id ON conversation_invites (conversation_id);

CREATE INDEX idx_invites_code ON conversation_invites (code);

CREATE INDEX idx_invites_expires_at ON conversation_invites (expires_at);

CREATE TABLE
    conversation_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        conversation_id UUID NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        role conversation_role NOT NULL DEFAULT 'member',
        joined_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        last_read_message_id UUID REFERENCES messages (id),
        last_read_at TIMESTAMPTZ,
        muted_until TIMESTAMPTZ,
        is_archived BOOLEAN NOT NULL DEFAULT FALSE,
        nickname TEXT,
        UNIQUE (conversation_id, user_id)
    );

CREATE INDEX idx_members_user_id ON conversation_members (user_id);

CREATE INDEX idx_members_conversation_id ON conversation_members (conversation_id);

CREATE TABLE
    message_receipts (
        message_id UUID NOT NULL REFERENCES messages (id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        delivered_at TIMESTAMPTZ,
        seen_at TIMESTAMPTZ,
        PRIMARY KEY (message_id, user_id)
    );

CREATE INDEX idx_receipts_user_id ON message_receipts (user_id);

CREATE INDEX idx_receipts_seen_at ON message_receipts (seen_at);

CREATE TABLE
    message_attachments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        message_id UUID NOT NULL REFERENCES messages (id) ON DELETE CASCADE,
        cloudinary_public_id TEXT NOT NULL,
        cloudinary_resource_type TEXT NOT NULL,
        file_url TEXT NOT NULL,
        filename TEXT,
        mime_type TEXT,
        size BIGINT,
        width INT,
        height INT,
        duration INT,
        thumbnail_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

CREATE INDEX idx_attachments_message_id ON message_attachments (message_id);

CREATE INDEX idx_attachments_mime_type ON message_attachments (mime_type);

CREATE TABLE
    conversation_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        requester_id UUID NOT NULL REFERENCES users (id),
        recipient_id UUID NOT NULL REFERENCES users (id),
        status conversation_request_status NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        responded_at TIMESTAMPTZ
    );

CREATE INDEX idx_conversation_requests_requester ON conversation_requests (requester_id);

CREATE INDEX idx_conversation_requests_recipient ON conversation_requests (recipient_id);

CREATE TABLE
    user_blocks (
        blocker_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        blocked_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        PRIMARY KEY (blocker_id, blocked_id)
    );

CREATE INDEX idx_user_blocks_blocker ON user_blocks (blocker_id);

CREATE INDEX idx_user_blocks_blocked ON user_blocks (blocked_id);

ALTER TABLE conversation_members ADD CONSTRAINT fk_conversation_members_last_read_message FOREIGN KEY (last_read_message_id) REFERENCES messages (id);