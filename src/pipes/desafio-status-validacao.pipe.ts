import { BadRequestException, PipeTransform } from '@nestjs/common';
import { DesafioStatus } from '../enums/desafio-status.enum';

export class DesafioStatusValidacaoPipe implements PipeTransform {
  readonly statusPemitido = [
    DesafioStatus.ACEITO,
    DesafioStatus.NEGADO,
    DesafioStatus.CANCELADO,
  ];

  transform(value: any) {
    console.log(value, 'value');
    const status = value && value.status ? value.status.toUpperCase() : '';
    if (status !== '' && !this.ehStatusValido(status))
      throw new BadRequestException(`${status} é um status inválido!`);

    return value;
  }

  private ehStatusValido(status: any) {
    const idx = this.statusPemitido.indexOf(status);
    return idx !== -1;
  }
}
