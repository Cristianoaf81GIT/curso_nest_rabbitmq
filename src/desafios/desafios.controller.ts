import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AtualizarDesafioDto } from 'src/dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from '../dtos/criar-desafio.dto';
import { DesafioStatusValidacaoPipe } from '../pipes/desafio-status-validacao.pipe';
import { Desafio } from '../interfaces/desafio.interface';
import { DesafiosService } from './desafios.service';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafioService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDto,
  ): Promise<Desafio> {
    return this.desafioService.criarDesafio(criarDesafioDto);
  }

  @Get()
  consultarDesafios(@Query('idJogador') _id: string): Promise<Array<Desafio>> {
    return _id
      ? this.desafioService.consultarDesafiosDeUmJogador(_id)
      : this.desafioService.consultarTodosOsDesafios();
  }

  @Put('/:desafio')
  async atualizarDesafio(
    @Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto,
    @Param('desafio') _id: string,
  ): Promise<void> {
    await this.desafioService.atualizarDesafio(_id, atualizarDesafioDto);
  }
}
