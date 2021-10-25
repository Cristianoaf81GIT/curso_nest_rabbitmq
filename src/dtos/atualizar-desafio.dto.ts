import { IsOptional } from 'class-validator';
import { DesafioStatus } from '../enums/desafio-status.enum';

export class AtualizarDesafioDto {
  @IsOptional()
  dataHoraDesafio: Date;
  @IsOptional()
  status: DesafioStatus;
}
