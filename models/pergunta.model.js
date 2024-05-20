var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

const respostaSchema = new mongoose.Schema({
  usuario: String,
  answer: mongoose.Schema.Types.Mixed ,// Alteração aqui
  quemRespondeu: String,
});


const alternativaSchema = new mongoose.Schema({
  codigoAlternativa: Number,
  descricaoAlternativa: String
});

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      codigoPergunta: Number,
      descricao: String,
      tipoPergunta: String,
      obrigatoria: Boolean,
      outro: Boolean,
      bloco: String,
      alternativa: [alternativaSchema],
      resposta: [respostaSchema],
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Pergunta = mongoose.model("pergunta", schema);
  return Pergunta;
};