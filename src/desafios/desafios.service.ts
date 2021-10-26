import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarDesafioDto } from '../dtos/criar-desafio.dto';
import { JogadoresService } from '../jogadores/jogadores.service';
import { Desafio } from '../interfaces/desafio.interface';
import { Jogador } from '../interfaces/jogador.interface';
import { CategoriasService } from '../categorias/categorias.service';
import { DesafioStatus } from '../enums/desafio-status.enum';
import { AtualizarDesafioDto } from '../dtos/atualizar-desafio.dto';
import { AtribuirDesafioPartidaDto } from '../dtos/atribuir-desafio-partida.dto';
import { Partida } from '../interfaces/partida.interface';

// https://gitlab.com/dfs-treinamentos/smart-ranking/api-smartranking-backend/-/blob/desafios_partidas/src/desafios/desafios.service.ts

@Injectable()
export class DesafiosService {
  private readonly logger = new Logger(DesafiosService.name);

  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriaService: CategoriasService,
  ) {}

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const jogadores = criarDesafioDto.jogadores;

    const jogadorSolicitante =
      await this.jogadoresService.consultarJogadorPorId(
        criarDesafioDto.solicitante as Jogador['_id'],
      );

    const jogador1 = await this.jogadoresService.consultarJogadorPorId(
      jogadores[0]._id,
    );

    const jogador2 = await this.jogadoresService.consultarJogadorPorId(
      jogadores[1]._id,
    );

    if (!jogadorSolicitante) {
      throw new NotFoundException(
        `o jogador solicitante _id: ${criarDesafioDto.solicitante} não foi encontrado!`,
      );
    }

    if (!jogador1)
      throw new NotFoundException(
        `o jogador com o _id: ${jogador1._id} não foi encontrado!`,
      );

    if (!jogador2)
      throw new NotFoundException(
        `o jogador com o _id: ${jogador2._id} não foi encontrado!`,
      );

    this.logger.debug(`solicitante: ${jogadorSolicitante._id}`);
    this.logger.debug(`jogadores: 1 ${jogador1._id} , 2 ${jogador2._id}`);

    const encontrarSolicitante = criarDesafioDto.jogadores.map(
      (jogador) => jogador._id == criarDesafioDto.solicitante,
    );

    if (encontrarSolicitante.length == 0) {
      throw new BadRequestException(
        'o solicitante deve ser um jogador da partida',
      );
    }

    const categoriaEncontrada =
      await this.categoriaService.consultarCategoriaDoJogador(
        criarDesafioDto.solicitante,
      );

    if (!categoriaEncontrada) {
      throw new NotFoundException(
        'nenhuma categoria foi encontrada para os jogadores',
      );
    }

    this.logger.debug(
      `categoria: ${categoriaEncontrada._id} - ${categoriaEncontrada.categoria}`,
    );

    const desafioCriado = new this.desafioModel(criarDesafioDto);
    desafioCriado.status = DesafioStatus.PENDENTE;
    desafioCriado.dataHoraSolicitacao = new Date();
    desafioCriado.categoria = categoriaEncontrada.categoria;
    this.logger.log(`desafioCriado: ${JSON.stringify(desafioCriado)}`);
    return desafioCriado.save();
  }

  async consultarDesafiosDeUmJogador(_id: string): Promise<Desafio[]> {
    const jogadores = await this.jogadoresService.consultarTodosJogadores();
    const jogadorFilter = jogadores.filter((jogador) => jogador._id == _id);
    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O id ${_id} não é um jogador!`);
    }

    return this.desafioModel
      .find()
      .where('jogadores')
      .in(_id as Desafio['_id'])
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }

  consultarTodosOsDesafios(): Promise<Desafio[]> {
    return this.desafioModel
      .find()
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }

  async atualizarDesafio(
    _id: string,
    atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<Desafio> {
    this.logger.debug(
      `id: ${_id}, dto: ${JSON.stringify(atualizarDesafioDto)}`,
    );
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();
    if (!desafioEncontrado)
      throw new NotFoundException(`Desafio ${_id} não cadastrado!`);

    if (atualizarDesafioDto.status) {
      desafioEncontrado.dataHoraResposta = new Date();
    }
    const oldStatus = desafioEncontrado.status;
    const oldDataHoraDesafio = desafioEncontrado.dataHoraDesafio;
    desafioEncontrado.status = atualizarDesafioDto.status
      ? atualizarDesafioDto.status
      : oldStatus;
    desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio
      ? atualizarDesafioDto.dataHoraDesafio
      : oldDataHoraDesafio;
    this.logger.debug(
      `desafio atualizado: ${JSON.stringify(desafioEncontrado)}`,
    );
    return await this.desafioModel
      .findOneAndUpdate(
        { _id },
        {
          $set: {
            status: desafioEncontrado.status,
            dataHoraDesafio: desafioEncontrado.dataHoraDesafio,
          },
        },
      )
      .exec();
  }

  async atribuirDesafioPartida(
    _id: string,
    atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();
    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }
    const jogadorFilter = desafioEncontrado.jogadores.filter(
      (jogador) => jogador._id == atribuirDesafioPartidaDto.def,
    );
    this.logger.log(`desafioEncontrado: ${desafioEncontrado}`);
    this.logger.log(`jogadorFilter: ${jogadorFilter}`);

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(
        `O jogador vencedor não faz parte do desafio!`,
      );
    }
    const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto);
    partidaCriada.categoria = desafioEncontrado.categoria;
    partidaCriada.jogadores = desafioEncontrado.jogadores;
    const resultado = await partidaCriada.save();
    desafioEncontrado.status = DesafioStatus.REALIZADO;
    desafioEncontrado.partida = resultado._id;
    try {
      await this.desafioModel
        .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
        .exec();
    } catch (error) {
      await this.partidaModel.deleteOne({ _id: resultado._id }).exec();
      throw new InternalServerErrorException();
    }
  }
}
