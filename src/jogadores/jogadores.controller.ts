import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Jogador } from '../interfaces/jogador.interface';
import { CriarJogadorDTO } from '../dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros-pipe';
import { AtualizarJogadorDTO } from '../dtos/atualizar-jogador.dto';
@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}
  @Post()
  @UsePipes(ValidationPipe)
  criarAtualizarJogador(
    @Body() criarJogadorDto: CriarJogadorDTO,
  ): Promise<Jogador> {
    return this.jogadoresService.criarJogador(criarJogadorDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Param('_id', ValidacaoParametrosPipe) _id: string,
    @Body() atualizarJogadorDto: AtualizarJogadorDTO,
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(_id, atualizarJogadorDto);
  }

  @Get()
  consultarJogadores(): Promise<Jogador[]> {
    return this.jogadoresService.consultarTodosJogadores();
  }

  @Get('/:_id')
  async consultarJogadorPeloId(
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    return this.jogadoresService.consultarJogadorPorId(_id);
  }

  @Delete('/:_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletarJogador(
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ): Promise<void> {
    this.jogadoresService.deletarJogadorPorId(_id);
  }
}
