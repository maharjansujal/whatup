-- 1. SEED USERS
-- Passwords are set to a dummy string 'mock_hash_here'
INSERT INTO
    users (username, display_name, email, password_hash, bio)
VALUES
    (
        'alice',
        'Alice Smith',
        'alice@example.com',
        '$2a$10$ILuX0I1AsfT203yyfnaZKexB4jLWn1Zn.KYpfK7XNte/xXyNAJuhy',
        'Software engineer loving Next.js.'
    ),
    (
        'bob',
        'Bob Jones',
        'bob@example.com',
        '$2a$10$ILuX0I1AsfT203yyfnaZKexB4jLWn1Zn.KYpfK7XNte/xXyNAJuhy',
        'Typescript enthusiast.'
    ),
    (
        'charlie',
        'Charlie Brown',
        'charlie@example.com',
        '$2a$10$ILuX0I1AsfT203yyfnaZKexB4jLWn1Zn.KYpfK7XNte/xXyNAJuhy',
        'Just here to chat.'
    );

-- 2. SEED CONVERSATIONS (Without last_message_id initially to avoid circular dependency)
INSERT INTO
    conversations (type, name, description, created_by_user_id)
VALUES
    ('direct', NULL, NULL, 1), -- Alice & Bob DM (ID: 1)
    ('group', 'Dev Talk', 'Tech chat', 2);

-- Bob's Group Chat (ID: 2)
-- 3. SEED CONVERSATION MEMBERS
INSERT INTO
    conversation_members (conversation_id, user_id, role)
VALUES
    (1, 1, 'member'), -- Alice in DM
    (1, 2, 'member'), -- Bob in DM
    (2, 2, 'owner'), -- Bob as Owner of Dev Talk
    (2, 1, 'member'), -- Alice in Dev Talk
    (2, 3, 'member');

-- Charlie in Dev Talk
-- 4. SEED CONVERSATION INVITES
INSERT INTO
    conversation_invites (
        conversation_id,
        code,
        created_by_user_id,
        max_uses
    )
VALUES
    (2, 'DEV123', 2, 10);

-- 5. SEED MESSAGES
INSERT INTO
    messages (conversation_id, sender_id, type, content)
VALUES
    (
        1,
        1,
        'text',
        'Hey Bob, did you see the new project structure?'
    ), -- Message ID: 1
    (1, 2, 'text', 'Yeah, looks incredibly clean.'), -- Message ID: 2
    (
        2,
        2,
        'text',
        'Welcome to Dev Talk everyone! Check this out.'
    ), -- Message ID: 3
    (
        2,
        1,
        'image',
        'Here is the architectural layout.'
    );

-- Message ID: 4
-- 6. UPDATE CONVERSATIONS WITH LAST MESSAGE POINTERS (Resolving the circular dependency)
UPDATE conversations
SET
    last_message_id = 2,
    last_message_at = now ()
WHERE
    id = 1;

UPDATE conversations
SET
    last_message_id = 4,
    last_message_at = now ()
WHERE
    id = 2;

-- 7. UPDATE MEMBERS WITH LAST READ MESSAGE POINTERS
UPDATE conversation_members
SET
    last_read_message_id = 2,
    last_read_at = now ()
WHERE
    conversation_id = 1
    AND user_id = 1;

UPDATE conversation_members
SET
    last_read_message_id = 1,
    last_read_at = now ()
WHERE
    conversation_id = 1
    AND user_id = 2;

-- 8. SEED MESSAGE RECEIPTS
INSERT INTO
    message_receipts (message_id, user_id, delivered_at, seen_at)
VALUES
    (1, 2, now (), now ()),
    (2, 1, now (), now ()),
    (3, 1, now (), now ()),
    (3, 3, now (), NULL);

-- Charlie delivered but not seen yet
-- 9. SEED MESSAGE ATTACHMENTS
INSERT INTO
    message_attachments (
        message_id,
        file_url,
        filename,
        mime_type,
        size,
        width,
        height
    )
VALUES
    (
        4,
        'https://example.com/uploads/schema.png',
        'schema.png',
        'image/png',
        245120,
        1920,
        1080
    );

-- 10. SEED CONVERSATION REQUESTS
INSERT INTO
    conversation_requests (
        conversation_id,
        requester_id,
        recipient_id,
        status
    )
VALUES
    (1, 1, 2, 'accepted');

-- 11. SEED USER BLOCKS
INSERT INTO
    user_blocks (blocker_id, blocked_id)
VALUES
    (3, 2);

-- Charlie blocked Bob (tough luck, Bob)