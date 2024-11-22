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
    const { id, author, content,title } = req.body;
    console.log(req.body);

    const user = await createUser(id, author, content,title);
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

app.delete("/article/:id", async (req, res) => {
    try {
      deleteUser(req.params.id);
      res.json({
        message: "updated",
      });
    } catch (err) {
      res.status(500).json({
        message: `Une erreur s'est produite lors de la mise à jour du nom de l'utilisateur : ${err}`,
      });
    }
  });

app.listen(port, () => console.log(`Server listening to port ${port}.`));
