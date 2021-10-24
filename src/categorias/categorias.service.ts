import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarCategoriaDto } from '../dtos/atualizar-categoria-dto';
import { CriarCategoriaDto } from '../dtos/criar-categoria.dto';
import { Categoria } from '../interfaces/categoria.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;
    const categoriaEncontrada = await this.categoriaModel
      .findOne({
        categoria,
      })
      .exec();
    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada!`);
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
    return categoriaCriada.save();
  }

  async consultarTodasCategorias(): Promise<Array<Categoria>> {
    return this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaPorId(categoria: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();
    if (!categoriaEncontrada) {
      throw new NotFoundException(
        `a categoria ${categoria} informada não foi encontrada`,
      );
    }
    return categoriaEncontrada;
  }

  async atualizarCategoria(
    categoria: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ): Promise<void> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();
    if (!categoriaEncontrada) {
      throw new NotFoundException(
        `a categoria ${categoria} informada não foi encontrada`,
      );
    }

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDto })
      .exec();
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();
    const jogadorEncontrado = await this.jogadoresService.consultarJogadorPorId(
      idJogador,
    );

    const jogadorJaCadastradoCategoria = this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in(idJogador)
      .exec();

    if (!categoriaEncontrada)
      throw new BadRequestException(`Categoria ${categoria} não encontrada`);

    if (!jogadorEncontrado)
      throw new BadRequestException(`jogador ${idJogador} não encontrado`);

    if (jogadorJaCadastradoCategoria)
      throw new BadRequestException(
        `jogador ${idJogador} já cadastrado na categoria`,
      );

    categoriaEncontrada.jogadores.push(idJogador);

    this.categoriaModel.findOneAndUpdate(
      { categoria },
      { $set: categoriaEncontrada },
    );
  }

  async consultarCategoriaDoJogador(idJogador: any): Promise<Categoria> {
    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    const jogadorFilter = jogadores.filter(
      (jogador) => jogador._id == idJogador,
    );

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O id ${idJogador} não é um jogador!`);
    }

    return this.categoriaModel
      .findOne()
      .where('jogadores')
      .in(idJogador)
      .exec();
  }
}
