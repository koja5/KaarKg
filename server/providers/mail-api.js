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
  var text = JSON.parse(
    fs.readFileSync(process.env.config_custom_text, "utf-8")
  );

  body["template"] = "activate_mail.hjs";
  body["email"] = req.body.email;
  body["link"] =
    process.env.link_api + "/verificationMail/1/" + sha1(req.body.email);

  //custom-text
  body["abg"] = text.agbConfigurationPage;
  body["privacyPolicy"] = text.privacyPolicyConfigurationPage;
  body["impressum"] = text.impressumConfigurationPage;

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
    var text = JSON.parse(
      fs.readFileSync(process.env.config_custom_text, "utf-8")
    );

    body["template"] = "activate_mail.hjs";
    body["email"] = req.body.email;
    body["link"] =
      process.env.link_api +
      "/verificationMailWithoutRelease/" +
      sha1(req.body.email);

    //custom-text
    body["abg"] = text.agbConfigurationPage;
    body["privacyPolicy"] = text.privacyPolicyConfigurationPage;
    body["impressum"] = text.impressumConfigurationPage;

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
  var text = JSON.parse(
    fs.readFileSync(process.env.config_custom_text, "utf-8")
  );

  body["template"] = "activate_mail.hjs";
  body["email"] = req.body.email;
  body["link"] =
    process.env.link_api +
    "/verificationMailWithoutRelease/" +
    sha1(req.body.email);

  //custom-text
  body["abg"] = text.agbConfigurationPage;
  body["privacyPolicy"] = text.privacyPolicyConfigurationPage;
  body["impressum"] = text.impressumConfigurationPage;

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
  var text = JSON.parse(
    fs.readFileSync(process.env.config_custom_text, "utf-8")
  );

  body["template"] = "approver_account_for_kindergarden.hjs";
  body["firstname"] = req.body.firstname;
  body["lastname"] = req.body.lastname;
  body["company"] = req.body.company;
  body["telephone"] = req.body.telephone;
  body["country_name"] = req.body.country_name;
  body["address"] = req.body.address;
  body["zip"] = req.body.zip;
  body["city"] = req.body.city;
  body["email_info"] = req.body.email;

  body["link"] = process.env.link_api + "activeUser/" + sha1(req.body.email);

  //custom-text
  body["abg"] = text.agbConfigurationPage;
  body["privacyPolicy"] = text.privacyPolicyConfigurationPage;
  body["impressum"] = text.impressumConfigurationPage;

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
  var text = JSON.parse(
    fs.readFileSync(process.env.config_custom_text, "utf-8")
  );

  body["template"] = "approve_account_for_dealer.hjs";
  body["firstname"] = req.body.firstname;
  body["lastname"] = req.body.lastname;
  body["company"] = req.body.company;
  body["telephone"] = req.body.telephone;
  body["country_name"] = req.body.country_name;
  body["address"] = req.body.address;
  body["zip"] = req.body.zip;
  body["city"] = req.body.city;
  body["email_info"] = req.body.email;

  body["link"] = process.env.link_api + "activeUser/" + sha1(req.body.email);

  //custom-text
  body["abg"] = text.agbConfigurationPage;
  body["privacyPolicy"] = text.privacyPolicyConfigurationPage;
  body["impressum"] = text.impressumConfigurationPage;

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
  let config = "approved-dealer-account-info.json";

  if (req.body.type === 1) {
    config = "approved-dealer-account-info.json";
  } else if (req.body.type === 2) {
    config = "approved-kindergarden-account-info.json";
  }

  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/mail_config/" + config, "utf-8")
  );
  var text = JSON.parse(
    fs.readFileSync(process.env.config_custom_text, "utf-8")
  );

  body["template"] = "info_approved_account_from_admin.hjs";
  body["email"] = req.body.email;
  body["link"] = process.env.link_client;
  body["greeting"] = body["greeting"].replace(
    "{firstname}",
    req.body.firstname
  );
  body["greeting"] = body["greeting"].replace("{lastname}", req.body.lastname);

  //custom-text
  body["abg"] = text.agbConfigurationPage;
  body["privacyPolicy"] = text.privacyPolicyConfigurationPage;
  body["impressum"] = text.impressumConfigurationPage;

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

router.post("/infoRejectedAccountFromAdmin", function (req, res, next) {
  let config = "rejected-dealer-account-info.json";

  if (req.body.type === 1) {
    config = "rejected-dealer-account-info.json";
  } else if (req.body.type === 2) {
    config = "rejected-kindergarden-account-info.json";
  }

  var body = JSON.parse(
    fs.readFileSync("./providers/mail_server/mail_config/" + config, "utf-8")
  );
  var text = JSON.parse(
    fs.readFileSync(process.env.config_custom_text, "utf-8")
  );

  body["template"] = "info_rejected_account_from_admin.hjs";
  body["email"] = req.body.email;
  body["link"] = process.env.link_client;
  body["greeting"] = body["greeting"].replace(
    "{firstname}",
    req.body.firstname
  );
  body["greeting"] = body["greeting"].replace("{lastname}", req.body.lastname);

  //custom-text
  body["abg"] = text.agbConfigurationPage;
  body["privacyPolicy"] = text.privacyPolicyConfigurationPage;
  body["impressum"] = text.impressumConfigurationPage;

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
  var text = JSON.parse(
    fs.readFileSync(process.env.config_custom_text, "utf-8")
  );

  body["template"] = "reset_password.hjs";
  body["email"] = req.body.email;
  body["link"] =
    process.env.link_client + "recovery-password/" + sha1(req.body.email);

  //custom-text
  body["abg"] = text.agbConfigurationPage;
  body["privacyPolicy"] = text.privacyPolicyConfigurationPage;
  body["impressum"] = text.impressumConfigurationPage;

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
  var text = JSON.parse(
    fs.readFileSync(process.env.config_custom_text, "utf-8")
  );

  if (req.body.type === 3) {
    body["template"] = "invoice_customer.hjs";
  } else {
    body["template"] = "invoice.hjs";
  }
  body["greeting"] = body["greeting"].replace(
    "{firstname}",
    req.body.mainAddress.firstname
  );
  body["greeting"] = body["greeting"].replace(
    "{lastname}",
    req.body.mainAddress.lastname
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
  body["shippingTelephone"] = req.body.shippingAddress.telephone
    ? "Tel: " + req.body.shippingAddress.telephone
    : "";
  body["shippingEmail"] = req.body.shippingAddress.email
    ? "E-mail: " + req.body.shippingAddress.email
    : "";
  body["shippingAddress"] = req.body.shippingAddress.address;
  body["shippingCountry"] = req.body.shippingAddress.country_name;
  body["shippingCompany"] = req.body.shippingAddress.company;
  body["shippingZip"] = req.body.shippingAddress.zip;
  body["shippingCity"] = req.body.shippingAddress.city;

  body["invoiceTitle"] = req.body.language.invoiceTitle;
  body["invoiceQuantity"] = req.body.language.invoiceQuantity;
  body["invoicePrice"] =
    req.body.type === 3
      ? req.body.language.invoicePriceCustomer
      : req.body.language.invoicePrice;
  body["invoiceTotalPerRow"] =
    req.body.type === 3
      ? req.body.language.invoiceTotalPerRowCustomer
      : req.body.language.invoiceTotalPerRow;
  body["invoiceTotal"] =
    req.body.type === 3
      ? req.body.language.invoiceTotalCustomer
      : req.body.language.invoiceTotal;
  body["invoiceMainAddress"] = req.body.language.invoiceMainAddress;
  body["invoiceShippingAddress"] = req.body.language.invoiceShippingAddress;
  body["invoiceOrderDate"] = req.body.language.invoiceOrderDate;
  body["invoiceUserNumber"] = req.body.mainAddress.user_number
    ? req.body.language.userNumber + ": " + req.body.mainAddress.user_number
    : "";
  body["invoicePaymentType"] = req.body.language.invoicePaymentType;
  body["invoiceShipping"] = req.body.language.invoiceShipping;
  body["invoiceSubtotal"] = req.body.language.invoiceSubtotal;
  body["invoiceVat"] = req.body.language.invoiceVat;
  body["products"] = req.body.products;
  body["subtotalNeto"] = Number(req.body.subtotalNeto).toFixed(2);
  body["shipping"] = req.body.shippingNotAvailable
    ? req.body.language.checkoutShippingNotAvailable
    : "€ " + Number(req.body.shipping).toFixed(2);
  body["vat"] = Number(req.body.vat).toFixed(2);
  body["total"] = Number(req.body.total).toFixed(2);

  body["orderDate"] = req.body.orderDate;

  body["paymentOption"] = req.body.paymentOption;

  //custom-text
  body["abg"] = text.agbConfigurationPage;
  body["privacyPolicy"] = text.privacyPolicyConfigurationPage;
  body["impressum"] = text.impressumConfigurationPage;

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
  var text = JSON.parse(
    fs.readFileSync(process.env.config_custom_text, "utf-8")
  );

  if (req.body.type === 3) {
    body["template"] = "invoice_superadmin_customer.hjs";
  } else {
    body["template"] = "invoice_superadmin.hjs";
  }

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
  body["shippingTelephone"] = req.body.shippingAddress.telephone
    ? "Tel: " + req.body.shippingAddress.telephone
    : "";
  body["shippingEmail"] = req.body.shippingAddress.email
    ? "E-mail: " + req.body.shippingAddress.email
    : "";
  body["shippingAddress"] = req.body.shippingAddress.address;
  body["shippingCompany"] = req.body.shippingAddress.company;
  body["shippingZip"] = req.body.shippingAddress.zip;
  body["shippingCity"] = req.body.shippingAddress.city;

  body["invoiceTitle"] = req.body.language.invoiceTitle;
  body["invoiceQuantity"] = req.body.language.invoiceQuantity;
  body["invoicePrice"] = req.body.language.invoicePrice;
  body["invoicePrice"] =
    req.body.type === 3
      ? req.body.language.invoicePriceCustomer
      : req.body.language.invoicePrice;
  body["invoiceTotalPerRow"] =
    req.body.type === 3
      ? req.body.language.invoiceTotalPerRowCustomer
      : req.body.language.invoiceTotalPerRow;
  body["invoiceTotal"] =
    req.body.type === 3
      ? req.body.language.invoiceTotalCustomer
      : req.body.language.invoiceTotal;
  body["invoiceMainAddress"] = req.body.language.invoiceMainAddress;
  body["invoiceShippingAddress"] = req.body.language.invoiceShippingAddress;
  body["invoiceOrderDate"] = req.body.language.invoiceOrderDate;
  body["invoiceUserNumber"] = req.body.mainAddress.user_number
    ? req.body.language.userNumber + ": " + req.body.mainAddress.user_number
    : "";
  body["invoicePaymentType"] = req.body.language.invoicePaymentType;
  body["invoiceShipping"] = req.body.language.invoiceShipping;
  body["invoiceSubtotal"] = req.body.language.invoiceSubtotal;
  body["invoiceVat"] = req.body.language.invoiceVat;
  body["products"] = req.body.products;
  body["subtotalNeto"] = Number(req.body.subtotalNeto).toFixed(2);
  body["shipping"] = req.body.shippingNotAvailable
    ? req.body.language.checkoutShippingNotAvailable
    : "€ " + Number(req.body.shipping).toFixed(2);
  body["vat"] = Number(req.body.vat).toFixed(2);
  body["total"] = Number(req.body.total).toFixed(2);

  body["orderDate"] = req.body.orderDate;
  body["paymentOption"] = req.body.paymentOption;

  //custom-text
  body["abg"] = text.agbConfigurationPage;
  body["privacyPolicy"] = text.privacyPolicyConfigurationPage;
  body["impressum"] = text.impressumConfigurationPage;

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

router.post("/sentErrorLogToAdmin", function (req, res, next) {
  var body = JSON.parse(
    fs.readFileSync(
      "./providers/mail_server/mail_config/verify-kindergarden.json",
      "utf-8"
    )
  );

  body["template"] = "sent_log_to_admin.hjs";
  body["subject"] = "Error log for KaarKG!"
  body["email"] = req.body.email;
  body["info"] = req.body.message;

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
