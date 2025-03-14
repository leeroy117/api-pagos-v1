import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { InfoalumnosService } from './infoalumnos.service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetStatusInscripcionDto } from './dto/GetStatusInscripcionDto';

@ApiTags('infoalumnos')
@Controller('infoalumnos')
export class InfoalumnosController {

    constructor(private readonly infoalumnosService: InfoalumnosService) {}

    @Version('1')
    @ApiOperation({ summary: 'Consulta el estatus de inscripcion de un alumno' })
    @ApiResponse({ 
            status: 200,  
            description: 'Responde 0 o 1 dependiendo el estatus de inscripcion, 0 es no vigente y 1 vigente', 
            example: 1
        })
    @Get('inscripciones')
    @ApiQuery({ name: 'id_alumno', required: true, type: Number })
    @ApiQuery({ name: 'id_tipo_inscripcion', required: true, enum: [2, 4], example: 2 })
    getYearlySuscription(
        @Query() data: GetStatusInscripcionDto
    ) {
        console.log("🚀 ~ InfoalumnosController ~ getYearlySuscription ~ data:", data)
        // const parsedIDAlumno = parseInt(idAlumno);
        return this.infoalumnosService.yearlySuscription(data);
    }
}
