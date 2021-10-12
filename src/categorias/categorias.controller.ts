import {
  Controller,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Categoria } from '../interfaces/categoria.interface';
import { CriarCategoriaDto } from '../dtos/criar-categoria.dto';
import { CategoriasService } from './categorias.service';

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
}
