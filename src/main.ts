import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { format } from 'date-fns-tz';
import ptBR from 'date-fns/locale/pt-BR';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  Date.prototype.toJSON = (): string =>
    format(this, 'yyyy-MM-dd HH:mm:ss.SS', {
      timeZone: 'America/Sao_Paulo',
      locale: ptBR,
    });
  await app.listen(8081);
}
bootstrap();
