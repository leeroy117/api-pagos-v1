import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { ApiExtraModels, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetPagosByAlumnoDto } from './dto/GetPagosByAlumnoDto';
import { pagosHistResponse } from './examples/pagosHistResponse';

@ApiTags('pagos/')
@Controller('pagos/')
export class PagosController {
    constructor(private readonly pagosService: PagosService) {}

    @Version('1')
    @Get('/')
    @ApiExtraModels(GetPagosByAlumnoDto)
    @ApiOperation({  summary: 'Consulta el historial de pagos de un alumno, cada pago contiene los items que fueron agregados en el pago' })
    @ApiResponse({ 
        status: 200,  
        description: 'Historial de los pagos del alumno con paginación.', 
        example: pagosHistResponse
    })
    @ApiQuery({ name: 'id_alumno', required: false, type: Number, example: 58999 })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 5 })
    async getPagos(@Query() queryParamsPagos: GetPagosByAlumnoDto) {
        console.log("🚀 ~ PagosController ~ getPagos ~ queryParamsPagos:", queryParamsPagos)
        // console.log("🚀 ~ PagosController ~ getPagos ~ idAlumno:", idAlumno)
        // const parsedIDAlumno = parseInt(idAlumno);
        const response = await this.pagosService.getPagos(queryParamsPagos);
        console.log("🚀 ~ PagosController ~ getPagos ~ response:", response)
        return response
    }
}
