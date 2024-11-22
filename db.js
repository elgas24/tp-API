require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DBS,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

///////////////////////////////////////////////
const fetchUsers = (offset = 0, maxResults = 10) => {
  return pool.query(
    "SELECT * FROM public.articles ORDER BY id ASC OFFSET $1 LIMIT $2",
    [offset, maxResults]
  );
};

///////////////////////////////////////////////
const updateUser = async (id, data) => {
  if (id === null) {
    const result = await pool.query(
      "INSERT INTO articles(author, content,title) VALUES($1, $2, $3) RETURNING *",
      [author, content, title]
    );
    res.status(201).json({
      message: "Un nouvel user a été ajouté à la table users.",
      result: result.rows,
    });
  } else {
    const result = pool.query(
      "UPDATE users SET content=$2, title=$3, WHERE id=$1",
      [id, author, content, title]
    );
    res.status(200).json(result);
  }
};

// // Méthodes
// const verifyUnicity = (title) => {
//     const result = pool.query(`SELECT COUNT(id) FROM articles WHERE title='${title}'`);
//     ans = new Boolean(result);
//     return result;

//   };

// Méthodes
const verifyUnicity = async (title) => {
  let result = await pool.query(
    `SELECT COUNT(id) FROM articles WHERE title ='${title}'`
  );
  result = new Boolean(Number(result.rows[0].count));
  // Assuming result.rows[0].count is an integer
  return Number(result);
};

///////////////////////////////////////////////
const createUser = async (author, title, content) => {
  if (await verifyUnicity(title)) {
    throw new Error("Article exists already");
  }
  const result = await pool.query(
    "INSERT INTO public.articles (id,author,title,content) VALUES(nextval('articles_id_seq'), $1,$2,$3) RETURNING *",
    [author, title, JSON.stringify(content)]
  );

  return result.rows[0];
};

///////////////////////////////////////////////
const deleteUser = async (id) => {
  console.log("here");
  const result = await pool.query("DELETE FROM public.articles WHERE id = $1", [
    id,
  ]);
  return result;
};

module.exports = { pool, fetchUsers, deleteUser, updateUser, createUser };
