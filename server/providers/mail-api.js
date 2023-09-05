require("dotenv").config();
const express = require("express");
const router = express.Router();
const fs = require("fs");
const sha1 = require("sha1");
const request = require("request");

module.exports = router;

router.post("/verificationMailAddress", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/mail_config/verify.json", "utf-8")
  );
  body["template"] = "activate_mail.hjs";
  body["email"] = req.body.email;
  body["link"] =
    process.env.link_api + "/verificationMail/1/" + sha1(req.body.email);
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body,
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
      fs.readFileSync(
        "./providers/mail_server/mail_config/verify-kindergarden.json",
        "utf-8"
      )
    );
    body["template"] = "activate_mail.hjs";
    body["email"] = req.body.email;
    body["link"] =
      process.env.link_api + "/verificationMail/0/" + sha1(req.body.email);
    var options = {
      url: process.env.link_api + "mail-server/sendMail",
      method: "POST",
      body: body,
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
    fs.readFileSync(
      "./providers/mail_server/mail_config/verify-dealer.json",
      "utf-8"
    )
  );
  body["template"] = "activate_mail.hjs";
  body["email"] = req.body.email;
  body["link"] =
    process.env.link_api + "/verificationMail/0/" + sha1(req.body.email);
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body,
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
    fs.readFileSync(
      "./providers/mail_server/mail_config/approve-kindergarden.json",
      "utf-8"
    )
  );
  body["template"] = "approver_account_for_kindergarden.hjs";
  body["firstname"] = req.body.firstname;
  body["lastname"] = req.body.lastname;
  body["company"] = req.body.company;
  body["telephone"] = req.body.telephone;
  body["email_info"] = req.body.email;

  body["link"] = process.env.link_api + "activeUser/" + sha1(req.body.email);
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body,
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
    fs.readFileSync(
      "./providers/mail_server/mail_config/approve-dealer.json",
      "utf-8"
    )
  );
  body["template"] = "approve_account_for_dealer.hjs";
  body["firstname"] = req.body.firstname;
  body["lastname"] = req.body.lastname;
  body["company"] = req.body.company;
  body["telephone"] = req.body.telephone;
  body["email_info"] = req.body.email;

  body["link"] = process.env.link_api + "activeUser/" + sha1(req.body.email);
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body,
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
    fs.readFileSync(
      "./providers/mail_server/mail_config/approved-account-info.json",
      "utf-8"
    )
  );
  body["template"] = "info_approved_account_from_admin.hjs";
  body["email"] = req.body.email;
  body["link"] = process.env.link_client;
  body["greeting"] = body["greeting"].replace(
    "{firstname}",
    req.body.lastname + " " + req.body.firstname
  );
  var options = {
    rejectUnauthorized: false,
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body,
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
    fs.readFileSync(
      "./providers/mail_server/mail_config/reset-password.json",
      "utf-8"
    )
  );
  body["template"] = "reset_password.hjs";
  body["email"] = req.body.email;
  body["link"] =
    process.env.link_client + "recovery-password/" + sha1(req.body.email);
  var options = {
    rejectUnauthorized: false,
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body,
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

router.post("/sendInvoiceToCustomer", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync(
      "./providers/mail_server/mail_config/invoice-customer.json",
      "utf-8"
    )
  );
  body["template"] = "invoice.hjs";
  body["greeting"] = body["greeting"].replace(
    "{firstname}",
    req.body.mainAddress.lastname + " " + req.body.mainAddress.firstname
  );
  body["email"] = req.body.shippingAddress.email
    ? req.body.shippingAddress.email
    : req.body.mainAddress.email;

  body["mainFirstname"] = req.body.mainAddress.firstname;
  body["mainLastname"] = req.body.mainAddress.lastname;
  body["mainTelephone"] = req.body.mainAddress.telephone;
  body["mainAddress"] = req.body.mainAddress.address;
  body["mainCountry"] = req.body.mainAddress.country_name;
  body["mainCompany"] = req.body.mainAddress.company;
  body["mainZip"] = req.body.mainAddress.zip;
  body["mainCity"] = req.body.mainAddress.city;
  body["mainEmail"] = req.body.mainAddress.email;

  body["shippingFirstname"] = req.body.shippingAddress.firstname;
  body["shippingLastname"] = req.body.shippingAddress.lastname;
  body["shippingTelephone"] = req.body.shippingAddress.telephone;
  body["shippingEmail"] = req.body.shippingAddress.email;
  body["shippingAddress"] = req.body.shippingAddress.address;
  body["shippingCountry"] = req.body.shippingAddress.country_name;
  body["shippingCompany"] = req.body.shippingAddress.company;
  body["shippingZip"] = req.body.shippingAddress.zip;
  body["shippingCity"] = req.body.shippingAddress.city;

  body["invoiceTitle"] = req.body.language.invoiceTitle;
  body["invoiceQuantity"] = req.body.language.invoiceQuantity;
  body["invoicePrice"] = req.body.language.invoicePrice;
  body["invoiceTotal"] = req.body.language.invoiceTotal;
  body["invoiceMainAddress"] = req.body.language.invoiceMainAddress;
  body["invoiceShippingAddress"] = req.body.language.invoiceShippingAddress;
  body["invoiceOrderDate"] = req.body.language.invoiceOrderDate;
  body["invoicePaymentType"] = req.body.language.invoicePaymentType;
  body["invoiceShipping"] = req.body.language.invoiceShipping;
  body["invoiceSubtotal"] = req.body.language.invoiceSubtotal;
  body["invoiceVat"] = req.body.language.invoiceVat;
  body["products"] = req.body.products;
  body["subtotalNeto"] = Number(req.body.subtotalNeto).toFixed(2);
  body["shipping"] = req.body.shippingNotAvailable
    ? req.body.language.checkoutShippingNotAvailable
    : "€ " + req.body.shipping;
  body["vat"] = req.body.vat;
  body["total"] = req.body.total;

  body["orderDate"] = req.body.orderDate;

  body["paymentOption"] = req.body.paymentOption;

  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body,
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
    fs.readFileSync(
      "./providers/mail_server/mail_config/invoice-superadmin.json",
      "utf-8"
    )
  );
  body["template"] = "invoice.hjs";

  body["mainFirstname"] = req.body.mainAddress.firstname;
  body["mainLastname"] = req.body.mainAddress.lastname;
  body["mainTelephone"] = req.body.mainAddress.telephone;
  body["mainAddress"] = req.body.mainAddress.address;
  body["mainCompany"] = req.body.mainAddress.company;
  body["mainZip"] = req.body.mainAddress.zip;
  body["mainCity"] = req.body.mainAddress.city;
  body["mainEmail"] = req.body.mainAddress.email;

  body["shippingFirstname"] = req.body.shippingAddress.firstname;
  body["shippingLastname"] = req.body.shippingAddress.lastname;
  body["shippingTelephone"] = "Tel: " + req.body.shippingAddress.telephone;
  body["shippingEmail"] = "E-mail: " + req.body.shippingAddress.email;
  body["shippingAddress"] = req.body.shippingAddress.address;
  body["shippingCompany"] = req.body.shippingAddress.company;
  body["shippingZip"] = req.body.shippingAddress.zip;
  body["shippingCity"] = req.body.shippingAddress.city;

  body["invoiceTitle"] = req.body.language.invoiceTitle;
  body["invoiceQuantity"] = req.body.language.invoiceQuantity;
  body["invoicePrice"] = req.body.language.invoicePrice;
  body["invoiceTotal"] = req.body.language.invoiceTotal;
  body["invoiceMainAddress"] = req.body.language.invoiceMainAddress;
  body["invoiceShippingAddress"] = req.body.language.invoiceShippingAddress;
  body["invoiceOrderDate"] = req.body.language.invoiceOrderDate;
  body["invoicePaymentType"] = req.body.language.invoicePaymentType;
  body["invoiceShipping"] = req.body.language.invoiceShipping;
  body["invoiceSubtotal"] = req.body.language.invoiceSubtotal;
  body["invoiceVat"] = req.body.language.invoiceVat;
  body["invoiceTotal"] = req.body.language.invoiceTotal;
  body["products"] = req.body.products;
  body["subtotalNeto"] = Number(req.body.subtotalNeto).toFixed(2);
  body["shipping"] = req.body.shippingNotAvailable
    ? req.body.language.checkoutShippingNotAvailable
    : "€ " + req.body.shipping;
  body["vat"] = req.body.vat;
  body["total"] = req.body.total;

  body["orderDate"] = req.body.orderDate;
  body["paymentOption"] = req.body.paymentOption;

  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body,
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
