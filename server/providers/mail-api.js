require("dotenv").config();
const express = require("express");
const router = express.Router();
const fs = require("fs");
const sha1 = require("sha1");
const request = require("request");

module.exports = router;

router.post("/verificationMailAddress", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.activate_mail.fields["email"] = req.body.email;
  body.activate_mail.fields["link"] =
    process.env.link_api + "/verificationMail/" + sha1(req.body.email);
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.activate_mail,
    json: true,
  };
  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
});

router.post(
  "/verificationMailAddressForKindergarden",
  function (req, res, next) {
    var body = JSON.parse(
      fs.readFileSync("./providers/mail_server/config.json", "utf-8")
    );
    body.activate_mail_for_kindergarden.fields["email"] = req.body.email;
    body.activate_mail_for_kindergarden.fields["link"] =
      process.env.link_api + "/verificationMail/" + sha1(req.body.email);
    var options = {
      url: process.env.link_api + "mail-server/sendMail",
      method: "POST",
      body: body.activate_mail_for_kindergarden,
      json: true,
    };
    request(options, function (error, response, body) {
      if (!error) {
        res.json(true);
      } else {
        res.json(false);
      }
    });
  }
);

router.post("/verificationMailAddressForDealer", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.activate_mail_for_dealer.fields["email"] = req.body.email;
  body.activate_mail_for_dealer.fields["link"] =
    process.env.link_api + "/verificationMail/" + sha1(req.body.email);
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.activate_mail_for_dealer,
    json: true,
  };
  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
});

router.post("/approveAccountForKindergarden", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.approve_account_for_kindergarden.fields["firstname"] =
    req.body.firstname;
  body.approve_account_for_kindergarden.fields["lastname"] = req.body.lastname;
  body.approve_account_for_kindergarden.fields["company"] = req.body.company;
  body.approve_account_for_kindergarden.fields["telephone"] =
    req.body.telephone;
  body.approve_account_for_kindergarden.fields["email_info"] = req.body.email;

  body.approve_account_for_kindergarden.fields["link"] =
    process.env.link_api + "activeUser/" + sha1(req.body.email);
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.approve_account_for_kindergarden,
    json: true,
  };
  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
});

router.post("/approveAccountForDealer", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.approve_account_for_dealer.fields["firstname"] = req.body.firstname;
  body.approve_account_for_dealer.fields["lastname"] = req.body.lastname;
  body.approve_account_for_dealer.fields["company"] = req.body.company;
  body.approve_account_for_dealer.fields["telephone"] = req.body.telephone;
  body.approve_account_for_dealer.fields["email_info"] = req.body.email;

  body.approve_account_for_dealer.fields["link"] =
    process.env.link_api + "activeUser/" + sha1(req.body.email);
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.approve_account_for_dealer,
    json: true,
  };
  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
});

router.post("/infoApprovedAccountFromAdmin", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.info_approved_account_from_admin.fields["email"] = req.body.email;
  body.info_approved_account_from_admin.fields["link"] =
    process.env.link_client;
  body.info_approved_account_from_admin.fields["greeting"] =
    body.info_approved_account_from_admin.fields["greeting"].replace(
      "{firstname}",
      req.body.firstname
    );
  var options = {
    rejectUnauthorized: false,
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.info_approved_account_from_admin,
    json: true,
  };
  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
});

router.post("/sentLinkToEmailForRecoveryPassword", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.reset_password.fields["email"] = req.body.email;
  body.reset_password.fields["link"] =
    process.env.link_client + "recovery-password/" + sha1(req.body.email);
  var options = {
    rejectUnauthorized: false,
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.reset_password,
    json: true,
  };
  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
  res.json(true);
});

router.post("/sendInvoiceToCustomer", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.invoiceToCustomer.fields["greeting"] = body.invoiceToCustomer.fields[
    "greeting"
  ].replace(
    "{firstname}",
    req.body.mainAddress.lastname + req.body.mainAddress.firstname
  );
  body.invoiceToCustomer.fields["email"] = req.body.shippingAddress.email;

  body.invoiceToCustomer.fields["mainFirstname"] =
    req.body.mainAddress.firstname;
  body.invoiceToCustomer.fields["mainLastname"] = req.body.mainAddress.lastname;
  body.invoiceToCustomer.fields["mainTelephone"] =
    req.body.mainAddress.telephone;
  body.invoiceToCustomer.fields["mainAddress"] = req.body.mainAddress.address;
  body.invoiceToCustomer.fields["mainCompany"] = req.body.mainAddress.company;
  body.invoiceToCustomer.fields["mainZip"] = req.body.mainAddress.zip;
  body.invoiceToCustomer.fields["mainCity"] = req.body.mainAddress.city;
  body.invoiceToCustomer.fields["mainEmail"] = req.body.mainAddress.email;

  body.invoiceToCustomer.fields["shippingFirstname"] =
    req.body.shippingAddress.firstname;
  body.invoiceToCustomer.fields["shippingLastname"] =
    req.body.shippingAddress.lastname;
  body.invoiceToCustomer.fields["shippingTelephone"] =
    req.body.shippingAddress.telephone;
  body.invoiceToCustomer.fields["shippingEmail"] =
    req.body.shippingAddress.email;
  body.invoiceToCustomer.fields["shippingAddress"] =
    req.body.shippingAddress.address;
  body.invoiceToCustomer.fields["shippingCompany"] =
    req.body.shippingAddress.company;
  body.invoiceToCustomer.fields["shippingZip"] = req.body.shippingAddress.zip;
  body.invoiceToCustomer.fields["shippingCity"] = req.body.shippingAddress.city;

  body.invoiceToCustomer.fields["invoiceTitle"] =
    req.body.language.invoiceTitle;
  body.invoiceToCustomer.fields["invoiceQuantity"] =
    req.body.language.invoiceQuantity;
  body.invoiceToCustomer.fields["invoicePrice"] =
    req.body.language.invoicePrice;
  body.invoiceToCustomer.fields["invoiceTotal"] =
    req.body.language.invoiceTotal;
  body.invoiceToCustomer.fields["invoiceMainAddress"] =
    req.body.language.invoiceMainAddress;
  body.invoiceToCustomer.fields["invoiceShippingAddress"] =
    req.body.language.invoiceShippingAddress;
  body.invoiceToCustomer.fields["invoiceOrderDate"] =
    req.body.language.invoiceOrderDate;
  body.invoiceToCustomer.fields["invoicePaymentType"] =
    req.body.language.invoicePaymentType;
  body.invoiceToCustomer.fields["invoiceShipping"] =
    req.body.language.invoiceShipping;
  body.invoiceToCustomer.fields["invoiceSubtotal"] =
    req.body.language.invoiceSubtotal;
  body.invoiceToCustomer.fields["invoiceVat"] = req.body.language.invoiceVat;
  body.invoiceToCustomer.fields["products"] = req.body.products;
  body.invoiceToCustomer.fields["subtotalNeto"] = Number(
    req.body.subtotalNeto
  ).toFixed(2);
  body.invoiceToCustomer.fields["shipping"] = req.body.shippingNotAvailable
    ? req.body.language.checkoutShippingNotAvailable
    : "€ " + req.body.shipping;
  body.invoiceToCustomer.fields["vat"] = req.body.vat;
  body.invoiceToCustomer.fields["total"] = req.body.total;

  body.invoiceToCustomer.fields["orderDate"] = req.body.orderDate;

  body.invoiceToCustomer.fields["paymentOption"] = req.body.paymentOption;

  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.invoiceToCustomer,
    json: true,
  };
  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
});

router.post("/sendInvoiceToSuperadmin", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );

  body.invoiceToSuperadmin.fields["mainFirstname"] =
    req.body.mainAddress.firstname;
  body.invoiceToSuperadmin.fields["mainLastname"] =
    req.body.mainAddress.lastname;
  body.invoiceToSuperadmin.fields["mainTelephone"] =
    req.body.mainAddress.telephone;
  body.invoiceToSuperadmin.fields["mainAddress"] = req.body.mainAddress.address;
  body.invoiceToSuperadmin.fields["mainCompany"] = req.body.mainAddress.company;
  body.invoiceToSuperadmin.fields["mainZip"] = req.body.mainAddress.zip;
  body.invoiceToSuperadmin.fields["mainCity"] = req.body.mainAddress.city;
  body.invoiceToSuperadmin.fields["mainEmail"] = req.body.mainAddress.email;

  body.invoiceToSuperadmin.fields["shippingFirstname"] =
    req.body.shippingAddress.firstname;
  body.invoiceToSuperadmin.fields["shippingLastname"] =
    req.body.shippingAddress.lastname;
  body.invoiceToSuperadmin.fields["shippingTelephone"] =
    req.body.shippingAddress.telephone;
  body.invoiceToSuperadmin.fields["shippingEmail"] =
    req.body.shippingAddress.email;
  body.invoiceToSuperadmin.fields["shippingAddress"] =
    req.body.shippingAddress.address;
  body.invoiceToSuperadmin.fields["shippingCompany"] =
    req.body.shippingAddress.company;
  body.invoiceToSuperadmin.fields["shippingZip"] = req.body.shippingAddress.zip;
  body.invoiceToSuperadmin.fields["shippingCity"] =
    req.body.shippingAddress.city;

  body.invoiceToSuperadmin.fields["invoiceTitle"] =
    req.body.language.invoiceTitle;
  body.invoiceToSuperadmin.fields["invoiceQuantity"] =
    req.body.language.invoiceQuantity;
  body.invoiceToSuperadmin.fields["invoicePrice"] =
    req.body.language.invoicePrice;
  body.invoiceToSuperadmin.fields["invoiceTotal"] =
    req.body.language.invoiceTotal;
  body.invoiceToSuperadmin.fields["invoiceMainAddress"] =
    req.body.language.invoiceMainAddress;
  body.invoiceToSuperadmin.fields["invoiceShippingAddress"] =
    req.body.language.invoiceShippingAddress;
  body.invoiceToSuperadmin.fields["invoiceOrderDate"] =
    req.body.language.invoiceOrderDate;
  body.invoiceToSuperadmin.fields["invoicePaymentType"] =
    req.body.language.invoicePaymentType;
  body.invoiceToSuperadmin.fields["invoiceShipping"] =
    req.body.language.invoiceShipping;
  body.invoiceToSuperadmin.fields["invoiceSubtotal"] =
    req.body.language.invoiceSubtotal;
  body.invoiceToSuperadmin.fields["invoiceVat"] = req.body.language.invoiceVat;
  body.invoiceToSuperadmin.fields["invoiceTotal"] =
    req.body.language.invoiceTotal;
  body.invoiceToSuperadmin.fields["products"] = req.body.products;
  body.invoiceToSuperadmin.fields["subtotalNeto"] = Number(
    req.body.subtotalNeto
  ).toFixed(2);
  body.invoiceToSuperadmin.fields["shipping"] = req.body.shippingNotAvailable
    ? req.body.language.checkoutShippingNotAvailable
    : "€ " + req.body.shipping;
  body.invoiceToSuperadmin.fields["vat"] = req.body.vat;
  body.invoiceToSuperadmin.fields["total"] = req.body.total;

  body.invoiceToSuperadmin.fields["orderDate"] = req.body.orderDate;
  body.invoiceToSuperadmin.fields["paymentOption"] = req.body.paymentOption;

  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.invoiceToSuperadmin,
    json: true,
  };
  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
});
