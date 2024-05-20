var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      comapany_id: String,
      application_id: String,
      token: String,
      version: Number
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const companyapplicationtoken = mongoose.model("companyapplicationtoken", schema);

  return companyapplicationtoken;
};