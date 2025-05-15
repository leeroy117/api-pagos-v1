import { Module } from '@nestjs/common';
import { MpbricksService } from './mpbricks.service';
import { MpbricksController } from './mpbricks.controller';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MpbricksController],
  providers: [MpbricksService, DatabaseService],
})
export class MpbricksModule {}
