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
  console.log(options);
  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
});

router.post("/infoForActiveFreeAd", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.info_about_changed_user_data.fields["email"] = req.body.email;
  body.info_about_changed_user_data.fields["greeting"] =
    body.info_about_changed_user_data.fields["greeting"].replace(
      "{firstname}",
      req.body.firstname
    );
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.info_about_changed_user_data,
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

router.post("/sentLinkToEmailForReset", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.reset_password.fields["email"] = req.body.email;
  body.reset_password.fields["link"] =
    process.env.link_client + "forgot-password/" + sha1(req.body.email);
  var options = {
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

router.post("/sendRequestForFreeAd", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.send_request_for_free_ad.fields["id"] = req.body.id;
  body.send_request_for_free_ad.fields["start_date"] = new Date(
    req.body.start_date
  )
    .toLocaleString("en-US")
    .substring(0, 9);
  body.send_request_for_free_ad.fields["ads_name"] = req.body.ads_name;
  body.send_request_for_free_ad.fields["city_name"] = req.body.city_name;
  body.send_request_for_free_ad.fields["number_of_weeks"] =
    req.body.number_of_weeks;
  body.send_request_for_free_ad.fields["link"] =
    process.env.link_client + "dashboard/superadmin/preview-ad/" + req.body.id;
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.send_request_for_free_ad,
    json: true,
  };
  console.log(options);
  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
});

router.post("/infoForActiveFreeAd", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.info_for_active_free_ad.fields["email"] = req.body.email;
  body.info_for_active_free_ad.fields["greeting"] =
    body.info_for_active_free_ad.fields["greeting"].replace(
      "{firstname}",
      req.body.firstname
    );
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.info_for_active_free_ad,
    json: true,
  };
  console.log(options);
  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
});

router.post("/infoForDenyFreeAd", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.info_for_deny_free_ad.fields["email"] = req.body.email;
  body.info_for_deny_free_ad.fields["greeting"] =
    body.info_for_deny_free_ad.fields["greeting"].replace(
      "{firstname}",
      req.body.firstname
    );
  var options = {
    url: process.env.link_api + "mail-server/sendMail",
    method: "POST",
    body: body.info_for_deny_free_ad,
    json: true,
  };
  console.log(options);
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
    fs.readFileSync("./providers/mail_server/config.json", "utf-8")
  );
  body.invoiceToCustomer.fields["greeting"] = body.invoiceToCustomer.fields[
    "greeting"
  ].replace("{firstname}", req.body.mainAddress.firstname);
  body.invoiceToCustomer.fields["email"] = req.body.mainAddress.email;

  body.invoiceToCustomer.fields["mainFirstname"] =
    req.body.mainAddress.firstname;
  body.invoiceToCustomer.fields["mainLastname"] = req.body.mainAddress.lastname;
  body.invoiceToCustomer.fields["mainTelephone"] =
    req.body.mainAddress.telephone;
  body.invoiceToCustomer.fields["mainAddress"] = req.body.mainAddress.address;
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
  body.invoiceToCustomer.fields["invoicePrepayment"] =
    req.body.language.invoicePrepayment;
  body.invoiceToCustomer.fields["products"] = req.body.products;
  body.invoiceToCustomer.fields["subtotalNeto"] = req.body.subtotalNeto;
  body.invoiceToCustomer.fields["shipping"] = req.body.shipping;
  body.invoiceToCustomer.fields["vat"] = req.body.vat;
  body.invoiceToCustomer.fields["total"] = req.body.total;

  body.invoiceToCustomer.fields["orderDate"] = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

  console.log(body.invoiceToCustomer);

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
  body.invoiceToSuperadmin.fields["invoicePrepayment"] =
    req.body.language.invoicePrepayment;
  body.invoiceToSuperadmin.fields["products"] = req.body.products;
  body.invoiceToSuperadmin.fields["subtotalNeto"] = req.body.subtotalNeto;
  body.invoiceToSuperadmin.fields["shipping"] = req.body.shipping;
  body.invoiceToSuperadmin.fields["vat"] = req.body.vat;
  body.invoiceToSuperadmin.fields["total"] = req.body.total;

  body.invoiceToSuperadmin.fields["orderDate"] = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

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
