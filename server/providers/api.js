require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const expiresToken = "12h";
const jwt = require("jsonwebtoken");
const auth = require("./config/auth");
const logger = require("./config/logger");
const request = require("request");
const fs = require("fs");
const sha1 = require("sha1");
const stripe = require("stripe")(
  "sk_test_51LhYhHL4uVudLiXAsXYCGWFY7RhraCcUwR9wbfV2xoL04pccSeLCLkbZvbPsxhivnRp9RJmu61YGFinNd7lKzOJz00r5f2ldt5"
);

module.exports = router;

/*var connection = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});*/

var connection = mysql.createPool({
  host: "116.203.109.78",
  user: "cityinfo_kaarkg",
  password: "p37wMevidufqWjbcg9hb1#DB",
  database: "cityinfo_kaarkg",
});

connection.getConnection(function (err, conn) {
  console.log(err);
  console.log(conn);
});

/* GET api listing. */
router.get("/", (req, res) => {
  // res.send("api works");
});

/* AUTH */

router.post("/signUp", async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(err);
      }
      conn.query(
        "select * from users where email = ?",
        [req.body.email],
        async function (err, rows, fields) {
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            return res.json(err);
          }
          if (rows.length > 0) {
            res.json(false);
          } else {
            req.body.password = sha1(req.body.password);
            req.body.type = 2;
            delete req.body.repeatPassword;
            conn.query(
              "insert into users set ?",
              req.body,
              async function (err) {
                if (err) {
                  logger.log("error", err.sql + ". " + err.sqlMessage);
                  return res.json(err);
                } else {
                  logger.log("info", "New user create account!");
                  var options = {
                    url: process.env.link_api + "verificationMailAddress",
                    method: "POST",
                    body: { email: req.body.email },
                    json: true,
                  };
                }
                request(options, function (error, response, body) {});
                res.json(true);
              }
            );
          }
        }
      );
    });
  } catch (err) {
    logger.log("error", err);
  }
});

router.post("/login", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      return res.json(err);
    }
    console.log(sha1(req.body.password));
    conn.query(
      "select * from users WHERE email=? AND password=? AND active = 1",
      [req.body.email, sha1(req.body.password)],
      function (err, rows, fields) {
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(err);
        }
        console.log(rows);
        if (rows.length > 0) {
          conn.end();
          const token = jwt.sign(
            {
              user: {
                id: rows[0].id,
                firstname: rows[0].firstname,
                type: rows[0].type,
                isClub: rows[0].is_club,
              },
              email: rows[0].email,
            },
            process.env.TOKEN_KEY,
            {
              expiresIn: expiresToken,
            }
          );
          logger.log(
            "info",
            `USER: ${req.body.email} is LOGIN at ${new Date().toDateString()}.`
          );
          return res.json({
            token: token,
          });
        } else {
          return res.json(false);
        }
      }
    );
  });
});

router.get("/verificationMail/:email", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "update users set active = 1 where SHA1(email) = ?",
          [req.params.email],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.redirect(process.env.link_client);
            }
          }
        );
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

/* AUTH */

/* NAVIGATION PRODUCTS */

router.post("/createNavigationProduct", auth, async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(err);
      }
      conn.query(
        "insert into navigation_products set ?",
        req.body,
        async function (err) {
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            return res.json(err);
          } else {
            logger.log("info", "Create new navigation product");
            res.json(true);
          }
        }
      );
    });
  } catch (err) {
    logger.log("error", err);
  }
});

router.post("/updateNavigationProduct", auth, async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(err);
      }
      conn.query(
        "update navigation_products set ? where id = ?",
        [req.body, req.body.id],
        async function (err) {
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            return res.json(err);
          } else {
            logger.log("info", "Update navigation product");
            res.json(true);
          }
        }
      );
    });
  } catch (err) {
    logger.log("error", err);
  }
});

router.post("/deleteNavigationProduct", auth, function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }
      conn.query(
        "delete from navigation_products where id = ?",
        [req.body.id],
        function (err, rows) {
          conn.release();
          if (!err) {
            res.json(true);
          } else {
            logger.log("error", `${err.sql}. ${err.sqlMessage}`);
            res.json(false);
          }
        }
      );
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get("/getAllNavigationProducts", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from (select id, name, id as 'category_id' from navigation_products where category_id = 0 union select n2.* from navigation_products n1 join navigation_products n2 on n1.id = n2.category_id) as t order by t.category_id asc, t.id asc",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              console.log(rows);
              res.json(rows);
            }
          }
        );
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

/* END NAVIGATION PRODUCTS */

/* NAVIGATION SUBPRODUCTS */
router.post(
  "/createNavigationSubproduct",
  auth,
  async function (req, res, next) {
    try {
      connection.getConnection(async function (err, conn) {
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          return res.json(err);
        }
        conn.query(
          "insert into navigation_subproducts set ?",
          req.body,
          async function (err) {
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              return res.json(err);
            } else {
              logger.log("info", "Create new navigation subproduct");
              res.json(true);
            }
          }
        );
      });
    } catch (err) {
      logger.log("error", err);
    }
  }
);

router.post(
  "/updateNavigationSubproduct",
  auth,
  async function (req, res, next) {
    try {
      connection.getConnection(async function (err, conn) {
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          return res.json(err);
        }
        conn.query(
          "update navigation_subproducts set ? where id = ?",
          [req.body, req.body.id],
          async function (err) {
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              return res.json(err);
            } else {
              logger.log("info", "Create new navigation product");
              res.json(true);
            }
          }
        );
      });
    } catch (err) {
      logger.log("error", err);
    }
  }
);

router.post("/deleteNavigationSubproduct", auth, function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }
      conn.query(
        "delete from navigation_subproducts where id = ?",
        [req.body.id],
        function (err, rows) {
          conn.release();
          if (!err) {
            res.json(true);
          } else {
            logger.log("error", `${err.sql}. ${err.sqlMessage}`);
            res.json(false);
          }
        }
      );
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get("/getAllNavigationSubproducts", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from navigation_subproducts",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              console.log(rows);
              res.json(rows);
            }
          }
        );
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

/* END NAVIGATION SUBPRODUCTS */

/* PRODUCTS */

router.get("/getAllProductsForCategory/:category", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select p.*, np.name from test p join navigation_products np on p.category_id = np.id where np.name like ?",
          req.params.category,
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              console.log(rows);
              res.json(rows);
            }
          }
        );
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get("/searchProducts/:category", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select p.*, np.name from test p join navigation_products np on p.category_id = np.id where p.title like '%" +
            req.params.category +
            "%'",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              console.log(rows);
              res.json(rows);
            }
          }
        );
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

/* END PRODUCTS */

router.get("/getUsers", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from users",
          req.params.category,
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              console.log(rows);
              res.json(rows);
            }
          }
        );
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});
