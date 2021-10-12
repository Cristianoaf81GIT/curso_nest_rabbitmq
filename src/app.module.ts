import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from './categorias/categorias.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://cristianoaf81:mongoAtlasCr2020@cluster0.cmkuy.gcp.mongodb.net/smartRanking?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        autoIndex: true,
        autoCreate: true,
        useUnifiedTopology: true,
      },
    ),
    JogadoresModule,
    CategoriasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
