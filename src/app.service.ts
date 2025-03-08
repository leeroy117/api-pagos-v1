import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {

  constructor(private readonly databaseService: DatabaseService) {

  }

  // async onModuleInit() {
  //   await this.databaseService.connect();
  // }

  // async onModuleDestroy() {
  //   await this.databaseService.close();
  // }

  getHello(): string {
    return 'Hello World!';
  }

  async getDatabase() {
    // const connection = await this.databaseService.getConnection();

    // const query = await connection.mysqlConnection.query('Select version();',[])
    // return query;
    const response = await this.databaseService.query('SELECT VERSION();', []);
    console.log("🚀 ~ AppService ~ getDatabase ~ response:", response)
  }
}
