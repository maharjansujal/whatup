-- =========================================================================
-- seed.sql
-- Populates the messaging-app schema with a large, referentially-consistent
-- set of test data. Written for PostgreSQL (uses generate_series, PL/pgSQL,
-- and the schema's own ENUM types).
--
-- Usage:
--   psql -d your_database -f seed.sql
--
-- Safe to re-run: it truncates all tables first (see TRUNCATE below).
-- Adjust the counts in the DECLARE block below to scale data volume.
-- =========================================================================

BEGIN;

TRUNCATE TABLE
    user_blocks,
    conversation_requests,
    message_attachments,
    message_receipts,
    messages,
    conversation_members,
    conversation_invites,
    conversations,
    users
RESTART IDENTITY CASCADE;

DO $$
DECLARE
    -- ---- tunable volume knobs ----------------------------------------
    v_num_users               CONSTANT INT := 120;
    v_num_direct_convos       CONSTANT INT := 40;
    v_num_group_convos        CONSTANT INT := 25;
    v_num_conversation_reqs   CONSTANT INT := 60;
    v_num_user_blocks         CONSTANT INT := 20;
    v_min_group_members       CONSTANT INT := 3;
    v_max_group_members       CONSTANT INT := 14;
    v_min_messages_per_convo  CONSTANT INT := 10;
    v_max_messages_per_convo  CONSTANT INT := 60;

    -- ---- working variables --------------------------------------------
    v_conv_id       BIGINT;
    v_creator_id    BIGINT;
    v_member_ids    BIGINT[];
    v_member_count  INT;
    v_i             INT;
    v_j             INT;
    v_msg_id        BIGINT;
    v_num_messages  INT;
    v_sender_id     BIGINT;
    v_msg_type      message_type;
    v_msg_time      TIMESTAMPTZ;
    v_convo_start   TIMESTAMPTZ;
    v_role          conversation_role;
    v_content       TEXT;
    v_a             BIGINT;
    v_b             BIGINT;
    v_code          TEXT;
    v_status        conversation_request_status;
    v_req_created   TIMESTAMPTZ;

    v_first_names TEXT[] := ARRAY['Alex','Jordan','Sam','Taylor','Morgan','Casey','Riley','Jamie','Avery','Quinn',
                                   'Dakota','Reese','Skyler','Rowan','Emerson','Finley','Hayden','Kendall','Peyton','Sawyer',
                                   'Blair','Charlie','Drew','Elliot','Frankie','Harper','Indigo','Jules','Kai','Lane'];
    v_last_names  TEXT[] := ARRAY['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
                                   'Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin'];
    v_words TEXT[] := ARRAY['hey there','sounds good','can we sync tomorrow','haha nice','did you see the update','on my way',
                              'thanks so much','let me check and get back to you','that works for me','no worries at all',
                              'here is the file you asked for','running a bit late','great meeting today','can you resend that link',
                              'happy birthday!','congrats on the launch','pushing the fix now','anyone free for lunch',
                              'love this idea','lets do a quick call','just landed','still waiting on review','looks great to me',
                              'can you take a look at this','all set on my end','ping me when you are free','see you soon',
                              'good catch, fixing it now','what time works best for you','sending over the notes now'];
    v_group_names TEXT[] := ARRAY['Project Falcon','Weekend Trip Planning','Design Team','Family Chat','Book Club',
                                    'Engineering Standup','Marketing Sync','Roommates','Gym Buddies','Trivia Night',
                                    'Startup Founders','Neighborhood Watch','Study Group','Game Night Crew','Alumni Network',
                                    'Hiking Club','Photography Circle','Product Launch','Support Squad','Music Jam Session'];
    v_filenames TEXT[] := ARRAY['invoice.pdf','vacation_photo.jpg','presentation.pptx','notes.txt','contract.docx',
                                  'diagram.png','budget.xlsx','logo.svg','recording.mp4','screenshot.png'];
BEGIN
    -- =====================================================================
    -- 1. USERS
    -- =====================================================================
    INSERT INTO users (username, display_name, email, password_hash, avatar_url, bio, last_seen_at, created_at, updated_at, deleted_at)
    SELECT
        lower(v_first_names[1 + (n % array_length(v_first_names,1))]
              || v_last_names[1 + ((n * 7) % array_length(v_last_names,1))]
              || n::text),
        v_first_names[1 + (n % array_length(v_first_names,1))] || ' ' ||
              v_last_names[1 + ((n * 7) % array_length(v_last_names,1))],
        lower(v_first_names[1 + (n % array_length(v_first_names,1))]
              || '.' || v_last_names[1 + ((n * 7) % array_length(v_last_names,1))]
              || n::text) || '@example.com',
        md5('password' || n::text),
        'https://picsum.photos/seed/user' || n::text || '/200/200',
        CASE WHEN random() < 0.6 THEN 'Just here to chat. #' || n::text ELSE NULL END,
        now() - (random() * interval '30 days'),
        now() - (random() * interval '365 days') - interval '30 days',
        now() - (random() * interval '10 days'),
        CASE WHEN random() < 0.03 THEN now() - (random() * interval '5 days') ELSE NULL END
    FROM generate_series(1, v_num_users) AS n;

    -- =====================================================================
    -- 2. DIRECT CONVERSATIONS (1:1) + members + messages
    -- =====================================================================
    FOR v_i IN 1..v_num_direct_convos LOOP
        SELECT id INTO v_a FROM users ORDER BY random() LIMIT 1;
        SELECT id INTO v_b FROM users WHERE id <> v_a ORDER BY random() LIMIT 1;
        v_creator_id := v_a;
        v_convo_start := now() - (random() * interval '300 days');

        INSERT INTO conversations (type, name, description, image_url, created_by_user_id, created_at, updated_at)
        VALUES ('direct', NULL, NULL, NULL, v_creator_id, v_convo_start, v_convo_start)
        RETURNING id INTO v_conv_id;

        INSERT INTO conversation_members (conversation_id, user_id, role, joined_at, is_muted, is_archived)
        VALUES
            (v_conv_id, v_a, 'member', v_convo_start, (random() < 0.1), (random() < 0.05)),
            (v_conv_id, v_b, 'member', v_convo_start, (random() < 0.1), (random() < 0.05));

        v_member_ids := ARRAY[v_a, v_b];
        v_num_messages := v_min_messages_per_convo + floor(random() * (v_max_messages_per_convo - v_min_messages_per_convo))::int;
        v_msg_time := v_convo_start;

        FOR v_j IN 1..v_num_messages LOOP
            v_sender_id := v_member_ids[1 + (v_j % 2)];
            v_msg_time := v_msg_time + (random() * interval '6 hours') + interval '1 minute';
            v_msg_type := (ARRAY['text','text','text','text','image','file']::message_type[])[1 + floor(random()*6)::int];
            v_content := CASE WHEN v_msg_type = 'text' THEN v_words[1 + floor(random() * array_length(v_words,1))::int]
                               ELSE NULL END;

            INSERT INTO messages (conversation_id, sender_id, type, content, created_at)
            VALUES (v_conv_id, v_sender_id, v_msg_type, v_content, v_msg_time)
            RETURNING id INTO v_msg_id;

            IF v_msg_type IN ('image','file') THEN
                INSERT INTO message_attachments (message_id, file_url, filename, mime_type, size, width, height, duration, thumbnail_url)
                VALUES (
                    v_msg_id,
                    'https://cdn.example.com/files/' || v_msg_id::text || '/' || v_filenames[1 + floor(random()*array_length(v_filenames,1))::int],
                    v_filenames[1 + floor(random()*array_length(v_filenames,1))::int],
                    CASE WHEN v_msg_type = 'image' THEN 'image/jpeg' ELSE 'application/octet-stream' END,
                    (1000 + floor(random()*5000000))::bigint,
                    CASE WHEN v_msg_type = 'image' THEN 400 + floor(random()*1200)::int ELSE NULL END,
                    CASE WHEN v_msg_type = 'image' THEN 300 + floor(random()*900)::int ELSE NULL END,
                    NULL,
                    CASE WHEN v_msg_type = 'image' THEN 'https://cdn.example.com/thumbs/' || v_msg_id::text || '.jpg' ELSE NULL END
                );
            END IF;

            INSERT INTO message_receipts (message_id, user_id, delivered_at, seen_at)
            SELECT v_msg_id, uid, v_msg_time + interval '2 seconds',
                   CASE WHEN random() < 0.85 THEN v_msg_time + (random() * interval '2 hours') ELSE NULL END
            FROM unnest(v_member_ids) AS uid
            WHERE uid <> v_sender_id;
        END LOOP;

        UPDATE conversations c
        SET last_message_id = m.id, last_message_at = m.created_at, updated_at = m.created_at
        FROM (SELECT id, created_at FROM messages WHERE conversation_id = v_conv_id ORDER BY created_at DESC LIMIT 1) m
        WHERE c.id = v_conv_id;

        UPDATE conversation_members cm
        SET last_read_message_id = m.id, last_read_at = m.created_at
        FROM (
            SELECT id, created_at FROM messages
            WHERE conversation_id = v_conv_id
            ORDER BY random() LIMIT 1
        ) m
        WHERE cm.conversation_id = v_conv_id AND random() < 0.7;
    END LOOP;

    -- =====================================================================
    -- 3. GROUP CONVERSATIONS + members + invites + messages
    -- =====================================================================
    FOR v_i IN 1..v_num_group_convos LOOP
        SELECT id INTO v_creator_id FROM users ORDER BY random() LIMIT 1;
        v_convo_start := now() - (random() * interval '300 days');

        INSERT INTO conversations (type, name, description, image_url, created_by_user_id, created_at, updated_at)
        VALUES (
            'group',
            v_group_names[1 + ((v_i - 1) % array_length(v_group_names,1))],
            'Group chat for ' || v_group_names[1 + ((v_i - 1) % array_length(v_group_names,1))],
            'https://picsum.photos/seed/group' || v_i::text || '/200/200',
            v_creator_id, v_convo_start, v_convo_start
        )
        RETURNING id INTO v_conv_id;

        INSERT INTO conversation_members (conversation_id, user_id, role, joined_at, is_muted, is_archived, nickname)
        VALUES (v_conv_id, v_creator_id, 'owner', v_convo_start, FALSE, FALSE, NULL);

        v_member_ids := ARRAY[v_creator_id];
        v_member_count := v_min_group_members + floor(random() * (v_max_group_members - v_min_group_members))::int;

        FOR v_j IN 1..v_member_count LOOP
            SELECT id INTO v_a FROM users WHERE id <> ALL(v_member_ids) ORDER BY random() LIMIT 1;
            IF v_a IS NULL THEN
                EXIT;
            END IF;
            v_role := (ARRAY['member','member','member','admin']::conversation_role[])[1 + floor(random()*4)::int];
            INSERT INTO conversation_members (conversation_id, user_id, role, joined_at, is_muted, is_archived, nickname)
            VALUES (v_conv_id, v_a, v_role, v_convo_start + (random() * interval '5 days'),
                    (random() < 0.15), (random() < 0.05),
                    CASE WHEN random() < 0.2 THEN 'buddy' || v_a::text ELSE NULL END);
            v_member_ids := array_append(v_member_ids, v_a);
        END LOOP;

        v_code := substr(md5(random()::text || v_conv_id::text), 1, 10);
        INSERT INTO conversation_invites (conversation_id, code, created_by_user_id, expires_at, max_uses, used_count, is_active, created_at)
        VALUES (
            v_conv_id, v_code, v_creator_id,
            CASE WHEN random() < 0.7 THEN now() + (random() * interval '60 days') ELSE NULL END,
            CASE WHEN random() < 0.5 THEN (5 + floor(random()*95))::int ELSE NULL END,
            floor(random()*5)::int,
            random() < 0.9,
            v_convo_start
        );

        v_num_messages := v_min_messages_per_convo + floor(random() * (v_max_messages_per_convo - v_min_messages_per_convo))::int;
        v_msg_time := v_convo_start;

        FOR v_j IN 1..v_num_messages LOOP
            v_sender_id := v_member_ids[1 + floor(random() * array_length(v_member_ids,1))::int];
            v_msg_time := v_msg_time + (random() * interval '4 hours') + interval '30 seconds';
            v_msg_type := (ARRAY['text','text','text','text','image','file','system']::message_type[])[1 + floor(random()*7)::int];
            v_content := CASE
                            WHEN v_msg_type = 'text' THEN v_words[1 + floor(random() * array_length(v_words,1))::int]
                            WHEN v_msg_type = 'system' THEN 'A member joined the conversation'
                            ELSE NULL
                         END;

            INSERT INTO messages (conversation_id, sender_id, type, content, created_at)
            VALUES (v_conv_id, CASE WHEN v_msg_type = 'system' THEN NULL ELSE v_sender_id END, v_msg_type, v_content, v_msg_time)
            RETURNING id INTO v_msg_id;

            IF v_j > 3 AND random() < 0.2 THEN
                UPDATE messages
                SET reply_to_message_id = (
                    SELECT id FROM messages
                    WHERE conversation_id = v_conv_id AND id < v_msg_id
                    ORDER BY random() LIMIT 1
                )
                WHERE id = v_msg_id;
            END IF;

            IF v_msg_type IN ('image','file') THEN
                INSERT INTO message_attachments (message_id, file_url, filename, mime_type, size, width, height, duration, thumbnail_url)
                VALUES (
                    v_msg_id,
                    'https://cdn.example.com/files/' || v_msg_id::text || '/' || v_filenames[1 + floor(random()*array_length(v_filenames,1))::int],
                    v_filenames[1 + floor(random()*array_length(v_filenames,1))::int],
                    CASE WHEN v_msg_type = 'image' THEN 'image/jpeg' ELSE 'application/octet-stream' END,
                    (1000 + floor(random()*5000000))::bigint,
                    CASE WHEN v_msg_type = 'image' THEN 400 + floor(random()*1200)::int ELSE NULL END,
                    CASE WHEN v_msg_type = 'image' THEN 300 + floor(random()*900)::int ELSE NULL END,
                    NULL,
                    CASE WHEN v_msg_type = 'image' THEN 'https://cdn.example.com/thumbs/' || v_msg_id::text || '.jpg' ELSE NULL END
                );
            END IF;

            INSERT INTO message_receipts (message_id, user_id, delivered_at, seen_at)
            SELECT v_msg_id, uid, v_msg_time + interval '2 seconds',
                   CASE WHEN random() < 0.75 THEN v_msg_time + (random() * interval '3 hours') ELSE NULL END
            FROM unnest(v_member_ids) AS uid
            WHERE uid <> v_sender_id AND random() < 0.8;
        END LOOP;

        UPDATE conversations c
        SET last_message_id = m.id, last_message_at = m.created_at, updated_at = m.created_at
        FROM (SELECT id, created_at FROM messages WHERE conversation_id = v_conv_id ORDER BY created_at DESC LIMIT 1) m
        WHERE c.id = v_conv_id;

        UPDATE conversation_members cm
        SET last_read_message_id = m.id, last_read_at = m.created_at
        FROM (
            SELECT id, created_at FROM messages
            WHERE conversation_id = v_conv_id
            ORDER BY random() LIMIT 1
        ) m
        WHERE cm.conversation_id = v_conv_id AND random() < 0.7;
    END LOOP;

    -- =====================================================================
    -- 4. CONVERSATION REQUESTS (DM/friend requests between users)
    -- =====================================================================
    FOR v_i IN 1..v_num_conversation_reqs LOOP
        SELECT id INTO v_a FROM users ORDER BY random() LIMIT 1;
        SELECT id INTO v_b FROM users WHERE id <> v_a ORDER BY random() LIMIT 1;
        v_status := (ARRAY['pending','accepted','declined','cancelled']::conversation_request_status[])[1 + floor(random()*4)::int];
        v_req_created := now() - (random() * interval '120 days');

        INSERT INTO conversation_requests (requester_id, recipient_id, status, created_at, responded_at)
        VALUES (
            v_a, v_b, v_status, v_req_created,
            CASE WHEN v_status <> 'pending' THEN v_req_created + (random() * interval '5 days') ELSE NULL END
        );
    END LOOP;

    -- =====================================================================
    -- 5. USER BLOCKS
    -- =====================================================================
    FOR v_i IN 1..v_num_user_blocks LOOP
        SELECT id INTO v_a FROM users ORDER BY random() LIMIT 1;
        SELECT id INTO v_b FROM users WHERE id <> v_a ORDER BY random() LIMIT 1;

        INSERT INTO user_blocks (blocker_id, blocked_id, created_at)
        VALUES (v_a, v_b, now() - (random() * interval '90 days'))
        ON CONFLICT DO NOTHING;
    END LOOP;

END $$;

COMMIT;

-- =========================================================================
-- Quick sanity check counts (safe to remove if you don't want this output)
-- =========================================================================
-- SELECT 'users' AS table_name, count(*) FROM users
-- UNION ALL SELECT 'conversations', count(*) FROM conversations
-- UNION ALL SELECT 'conversation_invites', count(*) FROM conversation_invites
-- UNION ALL SELECT 'conversation_members', count(*) FROM conversation_members
-- UNION ALL SELECT 'messages', count(*) FROM messages
-- UNION ALL SELECT 'message_receipts', count(*) FROM message_receipts
-- UNION ALL SELECT 'message_attachments', count(*) FROM message_attachments
-- UNION ALL SELECT 'conversation_requests', count(*) FROM conversation_requests
-- UNION ALL SELECT 'user_blocks', count(*) FROM user_blocks;