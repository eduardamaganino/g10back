var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const respostaSchemaPergDemografica = new mongoose.Schema({
  usuario: String,
  answerPergDemografica: mongoose.Schema.Types.Mixed ,
  quemRespondeu: String,
});

const alternativaSchemaPergDemografica = new mongoose.Schema({
  codAlterPergDemografica: Number,
  descAlterPergDemografica: String
});


module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      codPergDemografica: Number,
      descPergDemografica: String,
      tipoPergDemografica: String,
      perguntaNoRelatorio: String,
      respostaPergDemografica: [respostaSchemaPergDemografica],
      alternativaPergDemografica: [alternativaSchemaPergDemografica],


    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Demografica = mongoose.model("demografica", schema);
  return Demografica;
};