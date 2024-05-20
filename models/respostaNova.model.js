var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      usuario: String,
      answer: [String],
      quemRespondeu: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const RespostaNova = mongoose.model("respostaNova", schema);
  return RespostaNova;
};