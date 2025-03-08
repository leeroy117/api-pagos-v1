import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { MercadopagoModule } from './mercadopago/mercadopago.module';

@Module({
  imports: [DatabaseModule, MercadopagoModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
