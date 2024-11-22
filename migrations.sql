CREATE TABLE IF NOT EXISTS articles(
    id SERIAL PRIMARY KEY,
    author VARCHAR(100),
    title VARCHAR(180),
    content JSONB
); 

ALTER TABLE articles ADD COLUMN created_at timestamptz DEFAULT current_timestamp ;
