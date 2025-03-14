import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { MercadopagoModule } from './mercadopago/mercadopago.module';
import { PagosModule } from './pagos/pagos.module';
import { InfoalumnosModule } from './infoalumnos/infoalumnos.module';
import { ServiciosModule } from './servicios/servicios.module';
import { HealthCheckService } from '@nestjs/terminus';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [DatabaseModule, MercadopagoModule, PagosModule, InfoalumnosModule, ServiciosModule, HealthModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
