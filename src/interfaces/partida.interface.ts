import { Document } from 'mongoose';
import { Jogador } from './jogador.interface';
import { Resultado } from './resultado.interface';

export interface Partida extends Document {
  categoria: string;
  jogadores: Array<Jogador>;
  def: Jogador;
  resultado: Array<Resultado>;
}
