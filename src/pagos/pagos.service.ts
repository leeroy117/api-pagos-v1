import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PagosService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getPagos(idAlumno: number) {
        const query = 'call escolar.sp_pp_payments_hist(?)';
        const response = await this.databaseService.query(query, [idAlumno]);
        console.log("🚀 ~ PagosService ~ getPagos ~ response:", response);
        return response;
    }
}
