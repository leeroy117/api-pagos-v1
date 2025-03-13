import { Injectable } from '@nestjs/common';
import { TPago } from 'index';
import { DatabaseService } from 'src/database/database.service';
import { GetStatusInscripcionDto } from './dto/GetStatusInscripcionDto';

type IPagoInscripcion = {
    fecha_registro: string,
    fecha_expiracion: string,
    id_tipo: number
}

@Injectable()
export class InfoalumnosService {
    constructor(private readonly databaseService: DatabaseService){}

    async yearlySuscription(data: GetStatusInscripcionDto) {
        const {
            id_alumno: idAlumno,
            id_tipo_inscripcion: idTipoInscripcion
        } = data;

        console.log("🚀 ~ InfoalumnosService ~ yearlySuscription ~ idAlumno:", idAlumno)

        let pagos: IPagoInscripcion[] = [];

        if(idTipoInscripcion == 2){
            pagos = await this.databaseService.query(`
                    SELECT pag.id_alumno, pag.fecha_registro, pag.fecha_expiracion, ser.id_tipo 
                    from tb_pagos pag 
                    INNER JOIN tb_servicios ser ON ser.id = pag.id_servicio 
                    WHERE pag.fecha_expiracion is not null and ser.id_tipo = 2 and pag.id_alumno = ? ORDER BY pag.id DESC limit 1`, 
                    [idAlumno]
            );
        }

        if(idTipoInscripcion == 4){
            pagos = await this.databaseService.query(`
                    SELECT pag.id_alumno, pag.fecha_registro, pag.fecha_expiracion, ser.id_tipo 
                    from tb_pagos pag 
                    INNER JOIN tb_servicios ser ON ser.id = pag.id_servicio 
                    WHERE pag.fecha_expiracion is not null and ser.id_tipo = 4 and pag.id_alumno = ? ORDER BY pag.id DESC limit 1`, 
                    [idAlumno]
            );
        }

        
                
        if(pagos.length == 0 ){
            return 0;
        }
        
        const pago = pagos[0];

        const now = new Date(); // Fecha actual
        const otherDate = new Date(pago.fecha_expiracion); // Otra fecha a comparar

        if (now <= otherDate) {
            return 1;
        } else {
            return 0;
        }

    }
}
