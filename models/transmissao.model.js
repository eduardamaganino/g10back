var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      nome: String,
      assunto: String,
      mensagem: String,
      emailRemetente: String,
      contato: [{type: Schema.Types.ObjectId, ref: 'Contato'}],
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Transmissao = mongoose.model("transmissao", schema);
  return Transmissao;
};