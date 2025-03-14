import { Body, Controller, Get, HttpCode, Param, Post, Version } from '@nestjs/common';
import { CreatePreferenceCheckoutPro } from './dto/CreatePreferenceCheckoutProDto';
import { MercadopagoService } from './mercadopago.service';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { paymentPreference } from './examples/preferenceResponse';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@ApiTags('pasarela/mercadopago')
@Controller('pasarela/mercadopago')
export class MercadopagoController {

    constructor(private readonly mercadopagoService: MercadopagoService) {}

    @Version('1')
    @ApiOperation({ summary: 'Crea una preferencia en mercado pago que sirve para poder pagar.' })
    @ApiCreatedResponse({  description: 'Se devuelve el objeto regresado por mercado pago el cual contiene el init_point, que es necesario para generar la ventana de pago', example: paymentPreference })
    @HttpCode(201)
    @Post('preference')
    async createPreference(@Body() body: CreatePreferenceCheckoutPro) {
        console.log("🚀 ~ PagosMpController ~ createPreference ~ body:", body);
        return this.mercadopagoService.createPreference(body);
    }

    @ApiExcludeEndpoint()
    @Post()
    async listenEvents(@Body() body: any) {
        console.log("��� ~ PagosMpController ~ listenEvents ~ body:", body);
        this.mercadopagoService.listenEvents(body);
    }

    @ApiExcludeEndpoint()
    @Get('payments/:payment_id')
    async getPaymentDetails(@Param('payment_id') paymentId: string) {
        console.log("🚀 ~ MercadopagoController ~ getPaymentDetails ~ paymentId:", paymentId)
        return this.mercadopagoService.getPaymentDetails(paymentId);
    }

    @ApiExcludeEndpoint()
    @Get('payments/search')
    async getPayments() {
        return this.mercadopagoService.searchPayment();
    }
}
