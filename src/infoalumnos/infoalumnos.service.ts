import { Injectable } from '@nestjs/common';
import { TPago } from 'index';
import { DatabaseService } from 'src/database/database.service';

type IPagoInscripcion = {
    fecha_registro: string,
    fecha_expiracion: string,
    id_tipo: number
}

@Injectable()
export class InfoalumnosService {
    constructor(private readonly databaseService: DatabaseService){}

    async yearlySuscription(idAlumno: number) {
        console.log("🚀 ~ InfoalumnosService ~ yearlySuscription ~ idAlumno:", idAlumno)
        const pagos: IPagoInscripcion[] = await this.databaseService.query(`
                SELECT pag.id_alumno, pag.fecha_registro, pag.fecha_expiracion, ser.id_tipo 
                from tb_pagos pag 
                INNER JOIN tb_servicios ser ON ser.id = pag.id_servicio 
                WHERE pag.fecha_expiracion is not null and ser.id_tipo = 2 and pag.id_alumno = ? ORDER BY pag.id DESC limit 1`, 
                [idAlumno]
        );
        
                
        if(pagos.length == 0 ){
            return false;
        }
        
        const pago = pagos[0];

        const now = new Date(); // Fecha actual
        const otherDate = new Date(pago.fecha_expiracion); // Otra fecha a comparar

        if (now <= otherDate) {
            return true;
        } else {
            return false;
        }

    }
}
