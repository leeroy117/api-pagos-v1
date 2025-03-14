import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ServiciosService {
    constructor(private readonly databaseService: DatabaseService) {}

    
    async getServicios(idPlanEstudio: number) {
        const queryServicios = `CALL escolar.sp_pp_servicios_cat(?);`
        const response = await this.databaseService.query(queryServicios, [idPlanEstudio])
        return response[0];
    }
}
