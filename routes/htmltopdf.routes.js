module.exports = app => {
    var router = require("express").Router();
    const uploadhtml = require("../htmltopdf")
    var router = require("express").Router(); 

    router.post("/transformarhtml", uploadhtml.transformarhtml);
  
    app.use('/api/htmltopdf', router);
  };