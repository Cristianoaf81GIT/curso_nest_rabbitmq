import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarDesafioDto } from 'src/dtos/criar-desafio.dto';
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
}
