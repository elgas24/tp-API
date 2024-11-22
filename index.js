const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.SERVER_PORT || 3000;

const {
  createUser,
  fetchUsers,
  updateUser,
  deleteUser,
  pool,
} = require("./db");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

app.get("/articles", async (req, res) => {
  try {
    // const response = await getUsers(req, res);
    let page = req.query?.page || 1;
    //is a number ?
    page = isNaN(page) ? 1 : page;
    //normalize page ; starts from 1
    page = page < 1 ? 1 : page;

    //starts from 0
    const limit = 2;
    const offset = (page - 1) * limit;
    const { rows: users } = await fetchUsers(offset, limit);

    res.status(200).json(users);
    // console.log(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error whilst getting user list" });
  }
});

app.post("/article", async (req, res) => {
  try {
    const {author,content,title} = req.body;
    const user = await createUser(author,title,content);
    console.log("User created successfully:", user);
    res.status(201).json(user);
  } catch (err) { 
   console.error(err);
    res
      .status(500)
      .json({ message: "Error whilst creating user", reqBody: req.body });
  }
});


app.patch("/article/:id", async (req, res) => {
  try {
    updateUser(req.params.id, req.body);
    res.json({
      message: "updated",
    });
  } catch (err) {
    res.status(500).json({
      message: `Une erreur s'est produite lors de la mise à jour du nom de l'utilisateur : ${err}`,
    });
  }
});


// GET : Récupérer un article par ID
app.get('/articles/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).send('Article non trouvé.');
      }
    } catch (error) {
      res.status(500).send('Erreur lors de la récupération de l\'article.');
    }
  });
  

app.delete("/article/:id", async (req, res) => {
    try {
      deleteUser(req.params.id);
      res.json({
        message: "user deleted",
      });
    } catch (err) {
      res.status(500).json({
        message: `Une erreur s'est produite lors de la mise à jour du nom de l'utilisateur : ${err}`,
      });
    }
  });

app.listen(port, () => console.log(`Server listening to port ${port}.`));
