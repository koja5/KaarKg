require("dotenv").config();
const express = require("express");
const router = express.Router();
const fs = require("fs");

module.exports = router;

router.get("/readFile/:type", async function (req, res, next) {
  try {
    fs.readFile(
      __dirname + "/mail_server/mail_config/" + req.params.type,
      "utf8",
      function (err, data) {
        if (err) return err;
        console.log(data);
        res.json(JSON.parse(data));
      }
    );
  } catch (ex) {
    console.log(ex);
  }
});

router.post("/saveFile", function (req, res, next) {
  try {
    initial(JSON.stringify(req.body.data), req.body.file);
    res.json(true);
  } catch (ex) {
    console.log(ex);
  }
});

function initial(data, file) {
  fs.writeFile(__dirname + "/mail_server/mail_config/" + file, data, (err) => {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
}
