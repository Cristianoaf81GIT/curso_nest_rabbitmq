import * as Mongoose from 'mongoose';

export const CategoriaSchema = new Mongoose.Schema(
  {
    categoria: { type: String, unique: true },
    descricao: { type: String },
    eventos: [
      {
        nome: { type: String },
        operacao: { type: String },
        valor: { type: Number },
      },
    ],
    jogadores: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Jogador' }],
  },
  { timestamps: true, collection: 'categorias' },
);
