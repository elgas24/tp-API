const fs = require("fs");
require("dotenv").config();
const {pool} = require('./db')

const port = process.env.SERVER_PORT || 3000;


fs.readFile("migrations.sql", (err, buffer) => {
  if (err) {
    console.error("Error occured while reading migration file");
    throw err;
  }
  //  else {
  sql = buffer.toString("utf8");
  console.log(sql);
  pool
    .query(sql)
    .then(() => console.log("Migrations done"))
    .catch((err) => console.error(`error while running migrations: ${err}`));

  //   }
});