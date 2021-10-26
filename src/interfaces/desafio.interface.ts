import { Document } from 'mongoose';
import { DesafioStatus } from '../enums/desafio-status.enum';
import { Jogador } from './jogador.interface';
import { Partida } from './partida.interface';

export interface Desafio extends Document {
  dataHoraDesafio: Date;
  status: DesafioStatus;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: Jogador;
  categoria: string;
  jogadores: Array<Jogador>;
  partida: Partida;
}
