var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      nome: String,
      cnpj: String,
      email: String,
      telefone: Number
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Empresa = mongoose.model("empresa", schema);
  return Empresa;
};

