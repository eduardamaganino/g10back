var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      email: String,
      nome: String,
      telefone: Number
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Contato = mongoose.model("contato", schema);
  return Contato;
};