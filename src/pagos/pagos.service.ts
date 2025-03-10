import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PagosService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getPagos(idAlumno: number) {
        const query = 'SELECT * FROM tb_pagos WHERE id = ?';
        return await this.databaseService.query(query, []);
    }
}
