import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getRoot(): string {
    return `
      🚀 API: Pagos
      <br>
      💻 Entorno: Desarrollo
      <br>
      📅 Última actualización: 10/04/2025
      <br>
      🔧 Versión: v1.0.0
    `;
  }

  @Get('check-status')
  getHello()  {
    // return this.appService.getHello();
    // return this.health.check([
    //   async () => this.http.pingCheck('google', 'https://www.google.com'), // Checa si Google está disponible
    //   async () => this.db.pingCheck('database'), // Checa conexión a la BD (TypeORM)
    // ]);
   
  }

  // @Get('version')
  // getVersion() {
  //   return this.appService.getDatabase();
  // }
}
