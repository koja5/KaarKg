// const express = require("express");
// const app = require("./providers/config/app");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const api = require("./providers/api");
const mailApi = require("./providers/mail-api");
const mailServer = require("./providers/mail_server/mail-server");
const upload = require("./providers/upload");
const fileSystemApi = require("./providers/file-system-api");
const sqlDatabase = require("./providers/config/sql-database");
sqlDatabase.connect();

const express = require("express");
const router = express.Router();
// const express = require("express");

const app = express();

app.use(express.json());

module.exports = app;

app.use(function (req, res, next) {
  //allow cross origin requests
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, OPTIONS, DELETE, GET"
  );
  res.header("Access-Control-Allow-Origin", "http://localhost:4201");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Parsers for POST data
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());

//providers
app.use("/api", api);
app.use("/api", mailApi);
app.use("/api/mail-server", mailServer);
app.use("/api/upload", upload);
app.use("/api/save", fileSystemApi);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const port = process.env.PORT || "3001";
app.set("port", port);
const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));
server.timeout = 120000;

//chat

//chat END

// AUTOMATE WORK
