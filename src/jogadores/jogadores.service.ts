import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDTO } from '../dtos/criar-jogador.dto';
import { Jogador } from '../interfaces/jogador.interface';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);
  private jogadores: Jogador[] = [];

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDTO): Promise<void> {
    const { email } = criarJogadorDto;
    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );
    if (jogadorEncontrado) {
      this.atualizar(jogadorEncontrado, criarJogadorDto);
    } else {
      this.criar(criarJogadorDto);
    }
  }

  private criar(criarJogadorDto: CriarJogadorDTO): void {
    const { nome, email, telefoneCelular } = criarJogadorDto;
    const jogador: Jogador = {
      _id: uuidV4(),
      nome,
      telefoneCelular,
      email,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'http://https://wallhere.com/en/wallpaper/575590',
    };
    this.jogadores.push(jogador);
    this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`);
  }

  private atualizar(
    jogadorEncontrado: Jogador,
    criarJogdorDto: CriarJogadorDTO,
  ): void {
    const { nome } = criarJogdorDto;
    jogadorEncontrado.nome = nome;
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return this.jogadores;
  }

  async consultarJogadorPorEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);
    }
    return jogadorEncontrado;
  }

  async deletarJogadorPorEmail(email: string): Promise<void> {
    const jogadorEncontrado = await this.consultarJogadorPorEmail(email);
    this.jogadores = this.jogadores.filter(
      (jogador) => jogador.email !== jogadorEncontrado.email,
    );
  }
}
