var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      resposta: [String],
      usuario: String,
      idPergunta: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Resposta = mongoose.model("resposta", schema);
  return Resposta;
};