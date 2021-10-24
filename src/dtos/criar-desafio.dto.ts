import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Jogador } from '../interfaces/jogador.interface';

export class CriarDesafioDto {
  @IsNotEmpty()
  @MinLength(18)
  dataHoraDesafio: Date;

  @IsNotEmpty()
  solicitante: Jogador;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMinSize(2)
  jogadores: Array<Jogador>;
}
