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

router.get("/readTextFile/:type", async function (req, res, next) {
  try {
    fs.readFile(
      __dirname +
        "/../../client/src/assets/configurations/custom-text/" +
        req.params.type,
      "utf8",
      function (err, data) {
        if (err) return err;
        res.json(JSON.parse(data));
      }
    );
  } catch (ex) {
    console.log(ex);
  }
});

router.post("/saveTextFile", function (req, res, next) {
  try {
    initialText(JSON.stringify(req.body.data), req.body.file);
    res.json(true);
  } catch (ex) {
    console.log(ex);
  }
});

function initialText(data, file) {
  fs.writeFile(
    __dirname + "/../../client/src/assets/configurations/custom-text/" + file,
    data,
    (err) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    }
  );
}
