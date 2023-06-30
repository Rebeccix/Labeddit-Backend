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

    CREATE TABLE
    like_dislike_commentary (
        user_id TEXT NOT NULL,
        commentary_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        Foreign Key (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        Foreign Key (commentary_id ) REFERENCES commentary (id) ON UPDATE CASCADE ON DELETE CASCADE
    );
