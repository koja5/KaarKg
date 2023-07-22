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
            res.json(false);
          } else {
            req.body.password = sha1(req.body.password);
            delete req.body.repeatPassword;
            conn.query(
              "insert into users set ?",
              req.body,
              async function (err) {
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

router.get("/getMyShippingAddress", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select id, firstname, lastname, telephone, email, address from users where id = ?",
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
                console.log(rows[0]);
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
          "select p.id, p.category_id, p.product_number, p.title, p.description, p.price, p.image, np.name from products p join navigation_products np on p.category_id = np.id where np.name like ?",
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
          let query = "";
          if (userType === 0 || userType === 1) {
            query =
              "select p.id, p.category_id, p.product_number, p.title, p.description, p.price_dealer as 'price', p.image, np.name from products p join navigation_products np on p.category_id = np.id where np.name like ?";
          } else if (userType === 2) {
            query =
              "select p.id, p.category_id, p.product_number, p.title, p.description, p.price_kindergarden as 'price', p.image, np.name from products p join navigation_products np on p.category_id = np.id where np.name like ?";
          } else if (userType === 3) {
            query =
              "select p.id, p.category_id, p.product_number, p.title, p.description, p.price, p.image, np.name from products p join navigation_products np on p.category_id = np.id where np.name like ?";
          } else {
          }
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

router.get("/getProductById/:id", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from products where id = ?",
          req.params.id,
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

router.get("/searchProducts/:category", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select p.*, np.name from products p join navigation_products np on p.category_id = np.id where p.title like '%" +
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
      res.json(err);
    }

    if (
      req.body.current_password == req.body.new_password ||
      req.body.new_password != req.body.repet_new_password
    ) {
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

/* SHIPPING ADDRESS */

router.post("/createShippingAddress", auth, async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(err);
      }
      req.body.id_user = req.user.user.id;
      conn.query(
        "insert into shipping_address set ?",
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
});

router.post("/updateShippingAddress", auth, async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(err);
      }
      conn.query(
        "update shipping_address set ? where id = ?",
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
          "select * from shipping_address where id_user = ?",
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

const stripe = require("stripe")(
  "sk_test_51NSxCnAM4XTLtMHFbYr7Rv051CyPsZzl22mKWy2J3fKOwxqIvfaCXNcgeLzBZWi2LDPbgHxddspzF7tAGPCDDpQM00V6nSv8iJ"
);

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


router.post("/createCountry", auth, async function (req, res, next) {
  try {
    connection.getConnection(async function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        return res.json(false);
      }
      conn.query("insert into countries set ?", req.body, async function (err) {
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
            var option_request = {
              rejectUnauthorized: false,
              url: process.env.link_api + "infoForActiveFreeAd",
              method: "POST",
              body: req.body,
              json: true,
            };
            request(option_request, function (error, response, body) {});

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
