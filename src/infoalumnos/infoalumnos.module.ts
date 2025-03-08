import { Module } from '@nestjs/common';
import { InfoalumnosController } from './infoalumnos.controller';
import { InfoalumnosService } from './infoalumnos.service';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [DatabaseModule],
  controllers: [InfoalumnosController],
  providers: [InfoalumnosService, DatabaseService]
})
export class InfoalumnosModule {}
