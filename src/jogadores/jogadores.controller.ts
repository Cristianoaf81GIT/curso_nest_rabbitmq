import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { Jogador } from '../interfaces/jogador.interface';
import { CriarJogadorDTO } from '../dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';
@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}
  @Post()
  async criarAtualizarJogador(@Body() criarJogadorDto: CriarJogadorDTO) {
    await this.jogadoresService.criarAtualizarJogador(criarJogadorDto);
  }

  @Get()
  async consultarJogadores(
    @Query('email') email: string,
  ): Promise<Jogador[] | Jogador> {
    if (email) {
      return await this.jogadoresService.consultarJogadorPorEmail(email);
    } else {
      return await this.jogadoresService.consultarTodosJogadores();
    }
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletarJogador(@Query('email') email: string): Promise<void> {
    this.jogadoresService.deletarJogadorPorEmail(email);
  }
}
