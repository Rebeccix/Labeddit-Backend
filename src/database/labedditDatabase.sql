-- Active: 1686765077299@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT(DATETIME())
    );

INSERT INTO users
VALUES (
        'u00p00u001',
        'becca',
        'becca@email.com',
        'becca123',
        'NORMAL',
        '2023-06-02T13:11:15.619Z'
    ), (
        'u002',
        'cassia',
        'cassia@email.com',
        'cassia123',
        'NORMAL',
        '2023-05-02T13:11:15.619Z'
    ), (
        'u003',
        'teste',
        'teste@email.com',
        'teste123',
        'NORMAL',
        '2023-08-02T13:11:15.619Z'
    );

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        like INTEGER NOT NULL DEFAULT(0),
        dislike INTEGER NOT NULL DEFAULT(0),
        comments INTEGER NOT NULL DEFAULT(0),
        created_at TEXT NOT NULL DEFAULT(DATETIME()),
        updated_at TEXT NOT NULL DEFAULT(DATETIME()),
        foreign key (creator_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO posts
VALUES (
        'p001',
        'u003',
        'oi zinho?',
        5,
        14,
        '2023-06-02T13:11:15.619Z',
        '2023-06-02T13:11:15.619Z'
    ), (
        'p002',
        'u002',
        'qual seu nome?',
        1115,
        1,
        '2023-06-02T13:11:15.619Z',
        '2023-06-02T13:11:15.619Z'
    ), (
        'p003',
        'u001',
        'tudu baum?',
        0,
        2,
        '2023-06-02T13:11:15.619Z',
        '2023-06-02T13:11:15.619Z'
    );

    
CREATE TABLE
    like_dislike_post (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        Foreign Key (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        Foreign Key (post_id) REFERENCES posts (id) ON UPDATE CASCADE ON DELETE CASCADE
    );


CREATE TABLE
    commentary (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        content TEXT NOT NULL,
        like INTEGER NOT NULL DEFAULT(0),
        dislike INTEGER NOT NULL DEFAULT(0),
        created_at TEXT NOT NULL DEFAULT(DATETIME()),
        Foreign Key (creator_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        Foreign Key (post_id) REFERENCES posts (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO commentary
VALUES ('c001', 'u001', 'p001', 'oin', 5), (
        'c002',
        'u003',
        'p002',
        'teste',
        18
    );

    CREATE TABLE
    like_dislike_commentary (
        user_id TEXT NOT NULL,
        commentary_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        Foreign Key (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        Foreign Key (commentary_id ) REFERENCES commentary (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM commentary;

-- SELECT * FROM users INNER JOIN posts ON posts.creator_id = 1;