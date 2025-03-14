import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { internalErrorServerResponse, serviciosBadRequestResponse, serviciosResponse } from './examples/serviciosResponse';
import { GetServiciosDto } from './dto/GetServiciosDto';

@ApiTags('servicios')
@Controller('servicios')
export class ServiciosController {
    constructor(private readonly serviciosService: ServiciosService) { }

    @Version('1')
    @ApiOperation({  summary: 'Obtiene el listado de servicios disponibles por plan de estudio para cobrar en linea.'})
    @ApiParam({ name: 'id_plan_estudio', required: false, type: Number, example: 47 })
    @ApiResponse({ 
        status: 200, 
        example: serviciosResponse , 
        description: 'Regresa un listado de servicio que contiene id, nombre y precio del servicio' })
    @ApiResponse({ 
        status: 400, 
        example: serviciosBadRequestResponse , 
        description: 'Regresa un Bad Request indicando los campos enviados de forma incorrecta.' })
    @ApiResponse({ 
        status: 500, 
        example: internalErrorServerResponse , 
        description: 'Ocurrio un error inesperado al procesar la solicitud.' })
    @Get()
    async getServiciosV1(@Query() data: GetServiciosDto) {
        console.log("🚀 ~ ServiciosController ~ getServicios ~ data:", data)
        const { id_plan_estudio: idPlanEstudio  } = data;
        return this.serviciosService.getServicios(idPlanEstudio);
    }
}
