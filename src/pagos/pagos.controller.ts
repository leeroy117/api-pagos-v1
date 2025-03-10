import { Controller, Get, Param } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosService: PagosService){

    }

    @Get('pagos/:id_alumno')
    getPagos(@Param('id_alumno') idAlumno: string) {
        const parsedIDAlumno = parseInt(idAlumno);
        return this.pagosService.getPagos(parsedIDAlumno);
    }
}
