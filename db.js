require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DBS,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Méthodes
const verifyUnicity = (email) => {
    const result = pool.query(`SELECT COUNT(id) FROM users WHERE email=${email}`);
    result = new Boolean(result);
    return result;
  };

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
          [author, content,title]
        );
        res.status(201).json({
          message: "Un nouvel user a été ajouté à la table users.",
          result: result.rows,
        });
      } else {
        const result = pool.query(
          "UPDATE users SET content=$2, title=$3, WHERE id=$1",
          [id, author, content,title]
        );
        res.status(200).json(result);}
  };

  
 ///////////////////////////////////////////////
const createUser = async (author, content,title) => {
    if (verifyUnicity(title)) {
      throw new Error("article exists already");
    }
    console.log("here");
    const result = await pool.query(
      "INSERT INTO public.articles (author, content,title) VALUES(nextval('users_id_seq'), $1,$2,$3) RETURNING *",
      [author, content,title]
    );}


///////////////////////////////////////////////
const deleteUser = async (id) => {
    console.log("here");
    const result = await pool.query(
      "DELETE * FROM public.articles WHERE id = $1",
      [id]
    );}



module.exports = {pool, fetchUsers,deleteUser,updateUser,createUser};