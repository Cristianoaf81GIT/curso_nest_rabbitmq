import {
  Controller,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Categoria } from '../interfaces/categoria.interface';
import { CriarCategoriaDto } from '../dtos/criar-categoria.dto';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from '../dtos/atualizar-categoria-dto';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriaService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriaService.criarCategoria(criarCategoriaDto);
  }

  @Get()
  async consultarCategorias(): Promise<Array<Categoria>> {
    return await this.categoriaService.consultarTodasCategorias();
  }

  @Get('/:categoria')
  async consultarCategoriaPorId(@Param('categoria') categoria: string) {
    return await this.categoriaService.consultarCategoriaPorId(categoria);
  }

  @Put('/:categoria')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('categoria') categoria: string,
  ): Promise<void> {
    await this.categoriaService.atualizarCategoria(
      categoria,
      atualizarCategoriaDto,
    );
  }

  @Post('/:categoria/jogadores/:idJogador')
  async atribuirCategoriaJogador(@Param() params: string[]) {
    return await this.categoriaService.atribuirCategoriaJogador(params);
  }
}
