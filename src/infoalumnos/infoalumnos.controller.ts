import { Controller, Get, Param } from '@nestjs/common';
import { InfoalumnosService } from './infoalumnos.service';

@Controller('infoalumnos')
export class InfoalumnosController {

    constructor(private readonly infoalumnosService: InfoalumnosService){}

    @Get('inscripciones/:id_alumno')
    getYearlySuscription(@Param('id_alumno') idAlumno: string) {
        const parsedIDAlumno = parseInt(idAlumno);
        return this.infoalumnosService.yearlySuscription(parsedIDAlumno);
    }
}
