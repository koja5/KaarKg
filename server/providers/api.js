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
const stripe = require("stripe")(process.env.code);

module.exports = router;

var connection = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
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
      delete req.body.confirmPassword;
      delete req.body.privacy;
      conn.query(
        "select * from users where email = ?",
        [req.body.email],
        async function (err, rows, fields) {
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            return res.json(err);
          }
          if (rows.length > 0) {
            conn.release();
            res.json(false);
          } else {
            req.body.password = sha1(req.body.password);
            req.body["signup_time"] = new Date();
            delete req.body.repeatPassword;
            delete req.body.confirmEmail;
            const country_name = `${req.body.country_name}`;
            delete req.body.country_name;
            conn.query(
              "insert into users set ?",
              req.body,
              async function (err) {
                conn.release();
                if (err) {
                  logger.log("error", err.sql + ". " + err.sqlMessage);
                  return res.json(err);
                } else {
                  let mailTemplate = "";
                  let mailAdminTemplate = "";
                  if (req.body.type === 3) {
                    logger.log("info", "New user create account!");
                    mailTemplate = "verificationMailAddress";
                  } else if (req.body.type === 2) {
                    logger.log("info", "New kindergarden create account!");
                    logger.log(
                      "info",
                      "Sent mail for verify mail and active user from superadmin side"
                    );
                    mailTemplate = "verificationMailAddressForKindergarden";
                    mailAdminTemplate = "approveAccountForKindergarden";
                  } else {
                    logger.log("info", "New dealer create account!");
                    logger.log(
                      "info",
                      "Sent mail for verify mail and active user from superadmin side"
                    );
                    mailTemplate = "verificationMailAddressForDealer";
                    mailAdminTemplate = "approveAccountForDealer";
                  }

                  var options = {
                    url: process.env.link_api + mailTemplate,
                    method: "POST",
                    body: { email: req.body.email },
                    json: true,
                  };
                  request(options, function (error, response, body) {});

                  if (req.body.type === 1 || req.body.type === 2) {
                    req.body["country_name"] = country_name;
                    var options_admin = {
                      url: process.env.link_api + mailAdminTemplate,
                      method: "POST",
                      body: req.body,
                      json: true,
                    };
                    request(options_admin, function (error, response, body) {});
                  }
                }

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
    conn.query(
      "select * from users WHERE email=? AND password=?",
      [req.body.email, sha1(req.body.password)],
      function (err, rows, fields) {
        conn.release();
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(err);
        }

        if (rows.length > 0) {
          if (req.body.verified) {
            const token = jwt.sign(
              {
                user: {
                  id: rows[0].id,
                  firstname: rows[0].firstname,
                  type: rows[0].type,
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
              `USER: ${
                req.body.email
              } is LOGIN first time without verification at ${new Date().toDateString()}.`
            );
            return res.json({
              token: token,
            });
          } else if (rows[0].active && rows[0].verified) {
            const token = jwt.sign(
              {
                user: {
                  id: rows[0].id,
                  firstname: rows[0].firstname,
                  type: rows[0].type,
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
              `USER: ${
                req.body.email
              } is LOGIN at ${new Date().toDateString()}.`
            );
            return res.json({
              token: token,
            });
          } else if (!rows[0].verified) {
            return res.json({
              type: "verified",
              value: 0,
            });
          } else if (!rows[0].active) {
            return res.json({
              type: "active",
              value: 0,
            });
          }
        } else {
          return res.json({
            type: "exist",
            value: 0,
          });
        }
      }
    );
  });
});

router.get("/getMyShippingAddress", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select u.id, u.firstname, u.lastname, u.telephone, u.email, u.country_id, u.address, u.zip, u.city, u.company, c.name as 'country_name' from users u join countries c on u.country_id = c.id where u.id = ?",
          [req.user.user.id],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
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

router.get("/getMe", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from users where id = ?",
          [req.user.user.id],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
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

router.get("/verificationMail/:active/:email", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "update users set verified = 1, active = ? where SHA1(email) = ?",
          [req.params.active, req.params.email],
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

router.get("/recoveryMail/:email", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from users where email = ?",
          [req.params.email],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              if (rows.length > 0) {
                var option_request = {
                  rejectUnauthorized: false,
                  url:
                    process.env.link_api + "sentLinkToEmailForRecoveryPassword",
                  method: "POST",
                  body: rows[0],
                  json: true,
                };
                request(option_request, function (error, response, body) {});
                res.json(true);
              } else {
                res.json(false);
              }
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

router.post("/changePasswordRecovery", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    conn.query(
      "update users SET password = ? where sha1(email) = ?",
      [sha1(req.body.password), req.body.email],
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(true);
        } else {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(false);
        }
      }
    );
  });
});

router.get("/activeUser/:email", function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }
      conn.query(
        "update users SET active = 1 where sha1(email) = ?",
        [req.params.email],
        function (err, rows) {
          if (!err) {
            conn.query(
              "select * from users where sha1(email) = ?",
              [req.params.email],
              function (err, rows) {
                conn.release();
                var option_request = {
                  rejectUnauthorized: false,
                  url: process.env.link_api + "infoApprovedAccountFromAdmin",
                  method: "POST",
                  body: rows[0],
                  json: true,
                };
                request(option_request, function (error, response, body) {});
                return res.redirect("/");
              }
            );
          } else {
            conn.release();
            return res.redirect("/message/error");
          }
        }
      );
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
        "insert into navigations set ?",
        req.body,
        async function (err) {
          conn.release();
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
        "update navigations set ? where id = ?",
        [req.body, req.body.id],
        async function (err) {
          conn.release();
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
        "delete from navigations where id = ?",
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
          "select t.id, t.name, t.category_id, COUNT(t.title) as 'count' from (select n3.id, n3.name, n3.id as 'category_id', p1.title from navigations n3 left join articles p1 on p1.category_id = n3.id where n3.category_id = 0 or n3.category_id is NULL union select n2.*, p.title from navigations n1 join navigations n2 on n1.id = n2.category_id left join articles p on p.category_id = n2.id) as t group by t.id, t.name, t.category_id",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
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

router.get("/getAllNavigationProductsWithName", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select u.id, u.name, u.category_id, n4.name as 'category_name' from (select t.id, t.name, t.category_id, COUNT(t.title) as 'count' from (select n3.id, n3.name, n3.id as 'category_id', p1.title from navigations n3 left join articles p1 on p1.category_id = n3.id where n3.category_id = 0 or n3.category_id is NULL union select n2.*, p.title from navigations n1 join navigations n2 on n1.id = n2.category_id left join articles p on p.category_id = n2.id) as t group by t.id, t.name, t.category_id) u join navigations n4 on u.category_id = n4.id",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
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
            conn.release();
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
            conn.release();
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
      res.json(false);
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

router.get("/getAllProducts", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        let query = getProductsByAccountType(null);

        query += " where p.dealer_only = 0";

        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get("/getAllProductsForSuperadmin", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select p.*, np.name as 'category_name' from articles p join navigations np on p.category_id = np.id",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
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

router.get("/getAllProductsForLoginUser", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        let query = getProductsByAccountType(req.user.user.type);

        query += " where p.visibility = 1";

        if (req.user.user.type != 0 && req.user.user.type != 1) {
          query += " and p.dealer_only = 0";
        }

        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get("/getAllProductsForCategory/:category", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        let query = getProductsByAccountTypeForDifferentCategory(null);
        conn.query(query, req.params.category, function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get(
  "/getAllProductsForMainCategoryForLoginUser/:category",
  auth,
  async (req, res, next) => {
    try {
      connection.getConnection(function (err, conn) {
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(err);
        } else {
          conn.query(
            "select * from navigations where name like '%" +
              req.params.category +
              "%'",
            function (err, rows, fields) {
              if (err) {
                logger.log("error", err.sql + ". " + err.sqlMessage);
                conn.release();
                res.json(err);
              } else {
                conn.query(
                  "select * from navigations where category_id = ?",
                  rows[0].id,
                  function (err, categories, fields) {
                    categories.push(rows[0]);
                    let query = getProductsByAccountTypeForMainCategory(
                      req.user.user.type,
                      categories
                    );
                    conn.query(
                      query,
                      req.params.category,
                      function (err, rows, fields) {
                        conn.release();
                        if (err) {
                          logger.log("error", err.sql + ". " + err.sqlMessage);
                          res.json(err);
                        } else {
                          res.json(rows);
                        }
                      }
                    );
                  }
                );
              }
            }
          );
        }
      });
    } catch (ex) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(ex);
    }
  }
);

router.get(
  "/getAllProductsForMainCategory/:category",
  async (req, res, next) => {
    try {
      connection.getConnection(function (err, conn) {
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(err);
        } else {
          conn.query(
            "select * from navigations where name like '%" +
              req.params.category +
              "%'",
            function (err, rows, fields) {
              if (err) {
                logger.log("error", err.sql + ". " + err.sqlMessage);
                conn.release();
                res.json(err);
              } else {
                conn.query(
                  "select * from navigations where category_id = ?",
                  rows[0].id,
                  function (err, categories, fields) {
                    categories.push(rows[0]);
                    let query = getProductsByAccountTypeForMainCategory(
                      null,
                      categories
                    );
                    conn.query(
                      query,
                      req.params.category,
                      function (err, rows, fields) {
                        conn.release();
                        if (err) {
                          logger.log("error", err.sql + ". " + err.sqlMessage);
                          res.json(err);
                        } else {
                          res.json(rows);
                        }
                      }
                    );
                  }
                );
              }
            }
          );
        }
      });
    } catch (ex) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(ex);
    }
  }
);

router.get("/getAllNewProducts", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        let query = getProductsByAccountType(null);
        query +=
          " where p.new_product_until_date >= CAST(CURRENT_TIMESTAMP AS DATE) and p.visibility = 1 and p.dealer_only = 0";

        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get("/getAllActionsProducts", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        let query = getProductsByAccountType(null);

        query +=
          " where p.discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and p.discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) and p.visibility = 1 and p.dealer_only = 0";

        query += " having persantage != 0";

        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get(
  "/getAllProductsForCategoryForLoginUser/:category",
  auth,
  async (req, res, next) => {
    try {
      connection.getConnection(function (err, conn) {
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(err);
        } else {
          const userType = req.user.user.type;
          let query = getProductsByAccountTypeForDifferentCategory(userType);

          conn.query(query, req.params.category, function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(rows);
            }
          });
        }
      });
    } catch (ex) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(ex);
    }
  }
);

router.get("/getAllNewProductsForLoginUser", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        const userType = req.user.user.type;
        let query = getProductsByAccountType(userType);

        query +=
          " where p.new_product_until_date >= CAST(CURRENT_TIMESTAMP AS DATE) and p.visibility = 1";

        if (userType != 0 && userType != 1) {
          query += " and p.dealer_only = 0";
        }

        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get(
  "/getAllActionsProductsForLoginUser",
  auth,
  async (req, res, next) => {
    try {
      connection.getConnection(function (err, conn) {
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(err);
        } else {
          const userType = req.user.user.type;
          let query = getProductsByAccountType(userType);

          query +=
            " where p.discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and p.discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) and p.visibility = 1";

          if (userType != 0 && userType != 1) {
            query += " and p.dealer_only = 0";
          }

          query += " having persantage != 0";

          conn.query(query, function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(rows);
            }
          });
        }
      });
    } catch (ex) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(ex);
    }
  }
);

router.get("/getProductById/:id", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        let query = getProductsByAccountType(null);
        query += " where p.id = " + req.params.id;
        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get("/getProductByIdForLoginUser/:id", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        let query = getProductsByAccountType(req.user.user.type);
        query += " where p.id = " + req.params.id;
        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.post("/getProductPriceForLoginUser", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        let query = getProductPriceByAccountType(req.user.user.type, req.body);
        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.post("/getProductPrice", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        let query = getProductPriceByAccountType(false, req.body);
        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
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
        let query = searchProductByAccountType(null, req.params.category);
        conn.query(query, function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get(
  "/searchProductsForLoginUser/:category",
  auth,
  async (req, res, next) => {
    try {
      connection.getConnection(function (err, conn) {
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(err);
        } else {
          let query = searchProductByAccountType(
            req.user.user.type,
            req.params.category
          );
          conn.query(query, function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(rows);
            }
          });
        }
      });
    } catch (ex) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(ex);
    }
  }
);

router.post("/createProduct", auth, async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(false);
      }
      if (req.body.id) {
        delete req.body.id;
      }
      req.body["image"] = req.body.product_number + ".jpg";
      conn.query("insert into articles set ?", req.body, async function (err) {
        conn.release();
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          return res.json(false);
        } else {
          logger.log("info", "Create new city");
          res.json(true);
        }
      });
    });
  } catch (err) {
    logger.log("error", err);
    res.json(false);
  }
});

router.post("/updateProduct", auth, function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }

      if (req.body.discount_date_from) {
        req.body.discount_date_from = convertToDate(
          req.body.discount_date_from
        );
      }

      if (req.body.discount_date_to) {
        req.body.discount_date_to = convertToDate(req.body.discount_date_to);
      }

      if (req.body.new_product_until_date) {
        req.body.new_product_until_date = convertToDate(
          req.body.new_product_until_date
        );
      }

      conn.query(
        "update articles SET ? where id = ?",
        [req.body, req.body.id],
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

router.post("/deleteProduct", auth, function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }
      conn.query(
        "delete from articles where id = ?",
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

/* END PRODUCTS */

/* USERS */

router.get("/getUsers", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select u.*, c.name, a.name as 'type_name', rn.name as 'newsletter_name', ra.name as 'active_name' from users u join countries c on u.country_id = c.id join account_types a on u.type = a.id join rights_newsletter rn on u.newsletter = rn.id join rights_active ra on u.active = ra.id",
          req.params.category,
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
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

router.get("/getAccountTypes", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from account_types",
          req.params.category,
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
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

router.post("/createUser", auth, async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(false);
      }
      conn.query("insert into users set ?", req.body, async function (err) {
        conn.release();
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          return res.json(false);
        } else {
          logger.log("info", "Create new city");
          res.json(true);
        }
      });
    });
  } catch (err) {
    logger.log("error", err);
    res.json(false);
  }
});

router.post("/updateUser", auth, function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }

      if (req.body.country_name) {
        delete req.body.country_name;
      }

      conn.query(
        "update users SET ? where id = ?",
        [req.body, req.body.id],
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

router.post("/deleteUser", auth, function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }
      conn.query(
        "delete from users where id = ?",
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

router.post("/changePersonalInfo", auth, function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    conn.query(
      "update users SET ? where id = ?",
      [req.body, req.user.user.id],
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(true);
        } else {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(false);
        }
      }
    );
  });
});

router.post("/changePassword", auth, function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(false);
    }

    if (
      !req.body.current_password ||
      !req.body.new_password ||
      !req.body.repet_new_password ||
      req.body.password != sha1(req.body.current_password) ||
      req.body.current_password == req.body.new_password ||
      req.body.new_password != req.body.repet_new_password
    ) {
      conn.release();
      res.json(false);
    } else {
      conn.query(
        "update users SET password = ? where id = ?",
        [sha1(req.body.new_password), req.user.user.id],
        function (err, rows) {
          conn.release();
          if (!err) {
            res.json(true);
          } else {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(false);
          }
        }
      );
    }
  });
});

/* END USERS */

/* SHIPPING ADDRESS */

router.post("/createShippingAddress", auth, async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(err);
      }
      req.body.id_user = req.user.user.id;
      delete req.body.country_name;
      conn.query(
        "insert into shipping_address set ?",
        req.body,
        async function (err) {
          conn.release();
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
    res.json(false);
  }
});

router.post("/updateShippingAddress", auth, async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(err);
      }
      delete req.body.name;
      delete req.body.country_name;
      conn.query(
        "update shipping_address set ? where id = ?",
        [req.body, req.body.id],
        async function (err) {
          conn.release();
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
    req.json(false);
  }
});

router.post("/deleteShippingAddress", auth, function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }
      conn.query(
        "delete from shipping_address where id = ?",
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

router.get("/getAllShippingAddressForUser", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select s.*, c.name as 'country_name' from shipping_address s join countries c on s.country_id = c.id where s.id_user = ?",
          req.user.user.id,
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
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

/* END SHIPPING ADDRESS */

/* STRIPE */

router.post("/checkout", async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: {
        allowed_countries: ["AT"],
      },
      locale: "auto",
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: [item.image],
          },
          unit_amount: (item.price * 100).toFixed(0),
        },
        quantity: 1,
      })),
      mode: "payment",
      success_url:
        process.env.link_client + "payment-success/{CHECKOUT_SESSION_ID}",
      cancel_url: process.env.link_client + "payment-error",
    });
    res.status(200).json(session);
  } catch (error) {
    console.log(error);
  }
});

router.post("/createAdPayment", (req, res, next) => {
  stripe.charges.create(
    {
      amount: req.body.price * 100,
      currency: "EUR",
      description: req.body.description,
      source: req.body.token.id,
    },
    (err, charge) => {
      if (err) {
        res.json(false);
      } else {
        res.json(true);
      }
    }
  );
});

/* COUNTRIES */
router.get("/getCountries", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from countries",
          req.params.category,
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
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

router.post("/createCountry", auth, async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(false);
      }
      conn.query("insert into countries set ?", req.body, async function (err) {
        conn.release();
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          return res.json(false);
        } else {
          logger.log("info", "Create new city");
          res.json(true);
        }
      });
    });
  } catch (err) {
    logger.log("error", err);
    res.json(false);
  }
});

router.post("/updateCountry", auth, function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }
      conn.query(
        "update countries SET ? where id = ?",
        [req.body, req.body.id],
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

router.post("/deleteCountry", auth, function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }
      conn.query(
        "delete from countries where id = ?",
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

/* END COUNTRIES */

/* SHIPPING PRICES */

router.get("/getShippingPrices", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select sp.*, c.name from shipping_prices sp join countries c on sp.country_id = c.id",
          req.params.category,
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
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

router.post("/createShippingPrice", auth, async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(false);
      }
      conn.query(
        "insert into shipping_prices set ?",
        req.body,
        async function (err) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            return res.json(false);
          } else {
            logger.log("info", "Create new city");
            res.json(true);
          }
        }
      );
    });
  } catch (err) {
    logger.log("error", err);
    res.json(false);
  }
});

router.post("/updateShippingPrice", auth, function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }
      conn.query(
        "update shipping_prices SET ? where id = ?",
        [req.body, req.body.id],
        function (err, rows) {
          if (!err) {
            if (req.body.preselected) {
              conn.query(
                "update shipping_prices SET preselected = 0 where id != ?",
                [req.body.id],
                function (err, rows) {
                  if (!err) {
                    res.json(true);
                  } else {
                    logger.log("error", `${err.sql}. ${err.sqlMessage}`);
                    res.json(false);
                  }
                }
              );
            } else {
              conn.release();
              res.json(true);
            }
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

router.post("/deleteShippingPrice", auth, function (req, res, next) {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      }
      conn.query(
        "delete from shipping_prices where id = ?",
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

/* END SHIPPING PRICES */

function convertToDate(date) {
  return new Date(date);
}

function searchProductByAccountType(userType, category) {
  let query = "";
  if (userType === 0 || userType === 1) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, p.price_dealer as 'price', p.image, p.available, p.number_of_pieces, np.name, case when p.discount_price_dealer then CAST((((p.price_dealer - p.discount_price_dealer)/p.price_dealer) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price_dealer else 0 end as 'discount_price' from articles p join navigations np on p.category_id = np.id where p.title like '%" +
      category +
      "%' or p.product_number like '%" +
      category +
      "%' or p.description like '%" +
      category +
      "%' and p.visibility = 1";
  } else if (userType === 2) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, p.price_kindergarden as 'price', p.image, p.available, np.name, case when p.discount_price_kindergarden then CAST((((p.price_kindergarden - p.discount_price_kindergarden)/p.price_kindergarden) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price_kindergarden else 0 end as 'discount_price'  from articles p join navigations np on p.category_id = np.id where p.title like '%" +
      category +
      "%' or p.product_number like '%" +
      category +
      "%' or p.description like '%" +
      category +
      "%' and p.visibility = 1 and p.dealer_only = 0";
  } else if (userType === 3 || !userType) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, CAST(p.price as DECIMAL(16,2)) as 'price_neto', CAST(p.price_bruto as DECIMAL(16,2)) as 'price' , p.image, p.available, np.name, case when p.discount_price then CAST((((p.price_bruto - p.discount_price)/p.price_bruto) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price else 0 end as 'discount_price' from articles p join navigations np on p.category_id = np.id where p.title like '%" +
      category +
      "%' or p.product_number like '%" +
      category +
      "%' or p.description like '%" +
      category +
      "%' and p.visibility = 1 and p.dealer_only = 0";
  }
  return query;
}

function getProductsByAccountType(userType) {
  let query = "";
  if (userType === 0 || userType === 1) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, p.price_dealer as 'price', p.image, p.available, p.number_of_pieces, np.name, case when p.discount_price_dealer then CAST((((p.price_dealer - p.discount_price_dealer)/p.price_dealer) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price_dealer else 0 end as 'discount_price' from articles p join navigations np on p.category_id = np.id";
  } else if (userType === 2) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, p.price_kindergarden as 'price', p.image, p.available, np.name, case when p.discount_price_kindergarden then CAST((((p.price_kindergarden - p.discount_price_kindergarden)/p.price_kindergarden) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price_kindergarden else 0 end as 'discount_price'  from articles p join navigations np on p.category_id = np.id";
  } else if (userType === 3 || !userType) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, CAST(p.price as DECIMAL(16,2)) as 'price_neto', CAST(p.price_bruto as DECIMAL(16,2)) as 'price', p.image, p.available, np.name, case when p.discount_price then CAST((((p.price_bruto - p.discount_price)/p.price_bruto) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price else 0 end as 'discount_price' from articles p join navigations np on p.category_id = np.id";
  }
  return query;
}

function getProductPriceByAccountType(userType, products) {
  let query = "";
  let condition = "";
  for (let i = 0; i < products.length; i++) {
    condition += " id = " + products[i].id;
    if (i < products.length - 1) {
      condition += " or";
    }
  }
  if (userType === 0 || userType === 1) {
    query =
      "select id, case when discount_price_dealer then discount_price_dealer else price_dealer end as 'price' from articles where " +
      condition;
  } else if (userType === 2) {
    query =
      "select id, case when discount_price_kindergarden then discount_price_kindergarden else price_kindergarden end as 'price' from articles where " +
      condition;
  } else if (userType === 3 || !userType) {
    query =
      "select id, CAST(price as DECIMAL(16,2)) as 'price_neto', case when discount_price then discount_price else CAST(price_bruto as DECIMAL(16,2)) end as 'price' from articles where " +
      condition;
  }
  return query;
}

function getProductsByAccountTypeForDifferentCategory(userType) {
  let query = "";
  if (userType === 0 || userType === 1) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, p.price_dealer as 'price', p.number_of_pieces, p.image, p.available, np.name, case when p.discount_price_dealer then CAST((((p.price_dealer - p.discount_price_dealer)/p.price_dealer) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price_dealer else 0 end as 'discount_price' from articles p join navigations np on p.category_id = np.id where np.name like ? and p.visibility = 1";
  } else if (userType === 2) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, p.price_kindergarden as 'price', p.image, p.available, np.name, case when p.discount_price_kindergarden then CAST((((p.price_kindergarden - p.discount_price_kindergarden)/p.price_kindergarden) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price_kindergarden else 0 end as 'discount_price'  from articles p join navigations np on p.category_id = np.id where np.name like ? and p.visibility = 1 and p.dealer_only = 0";
  } else if (userType === 3 || !userType) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, CAST(p.price as DECIMAL(16,2)) as 'price_neto', CAST(p.price_bruto as DECIMAL(16,2)) as 'price', p.image, p.available, np.name, case when p.discount_price then CAST((((p.price_bruto - p.discount_price)/p.price_bruto) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price else 0 end as 'discount_price' from articles p join navigations np on p.category_id = np.id where np.name like ? and p.visibility = 1 and p.dealer_only = 0";
  }
  return query;
}

function getProductsByAccountTypeForMainCategory(userType, categories) {
  let query = "";
  let condition = "";
  let i = 0;
  while (i < categories.length) {
    condition += " p.category_id = " + categories[i].id;
    ++i;
    if (i < categories.length) {
      condition += " or";
    }
  }
  if (userType === 0 || userType === 1) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, p.price_dealer as 'price', p.number_of_pieces, p.image, p.available, case when p.discount_price_dealer then CAST((((p.price_dealer - p.discount_price_dealer)/p.price_dealer) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price_dealer else 0 end as 'discount_price', n.name from articles p join navigations n on p.category_id = n.id where " +
      condition +
      " and p.visibility = 1";
  } else if (userType === 2) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, p.price_kindergarden as 'price', p.image, p.available, case when p.discount_price_kindergarden then CAST((((p.price_kindergarden - p.discount_price_kindergarden)/p.price_kindergarden) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price_kindergarden else 0 end as 'discount_price', n.name from articles p join navigations n on p.category_id = n.id where " +
      condition +
      " and p.visibility = 1 and p.dealer_only = 0";
  } else if (userType === 3 || !userType) {
    query =
      "select p.id, p.category_id, p.product_number, p.title, p.title_short, p.description, CAST(p.price as DECIMAL(16,2)) as 'price_neto', CAST(p.price_bruto as DECIMAL(16,2)) as 'price', p.image, p.available, case when p.discount_price then CAST((((p.price_bruto - p.discount_price)/p.price_bruto) * 100) as DECIMAL(16,0)) else 0 end as 'persantage', case when new_product_until_date > CAST(CURRENT_TIMESTAMP AS DATE) then 1 else 0 end as 'new', case when discount_date_from <= CAST(CURRENT_TIMESTAMP AS DATE) and discount_date_to >= CAST(CURRENT_TIMESTAMP AS DATE) then discount_price else 0 end as 'discount_price', n.name from articles p join navigations n on p.category_id = n.id where " +
      condition +
      " and p.visibility = 1 and p.dealer_only = 0";
  }
  return query;
}
