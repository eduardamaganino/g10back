var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      nome: String,
      ativa: Boolean,
      dataHoraInicio: Date,
      dataHoraFinal: Date,
      entrevistado: Boolean,
      pesoEntrevistado: Number,
      entrevistador: Boolean,
      pesoEntrevistador: Number,
      numResposta: String,
      dividirEmBlocos: Number, 
      showAlternativas: String,
      nameEntrevistado: String,
      nameEntrevistador: String,
      pergunta: [{type: Schema.Types.ObjectId, ref: 'Pergunta'}],
      transmissao: [{type: Schema.Types.ObjectId, ref: 'Transmissao'}],
      demografica: [{type: Schema.Types.ObjectId, ref: 'Demografica'}],

    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Enquete = mongoose.model("enquete", schema);
  return Enquete;
};
