module.exports = app => {
    const companyapplicationtoken = require("../app/controllers/companyapplicationtoken.controller.js");
    var router = require("express").Router();

    // Retrieve all tenents
    router.get("/", companyapplicationtoken.findAll);
    app.use('/api/company', router);
  };