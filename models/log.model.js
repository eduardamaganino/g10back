var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      editor: String,
      dataHora: Date,
      tipoEvento: String,
      idAlterado: String,
      nomeCampo: String,
      tabela: String,
      valorAntigo: String,
      valorNovo: String,
      ip: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Logs = mongoose.model("log", schema);
  return Logs;
};