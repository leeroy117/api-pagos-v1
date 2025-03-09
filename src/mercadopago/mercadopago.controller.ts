import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePreferenceCheckoutPro } from './dto/CreatePreferenceCheckoutProDto';
import { MercadopagoService } from './mercadopago.service';

@Controller('pasarela/mercadopago')
export class MercadopagoController {

    constructor(private readonly mercadopagoService: MercadopagoService){}

    @Post('preference')
    async createPreference(@Body() body: CreatePreferenceCheckoutPro) {
        console.log("🚀 ~ PagosMpController ~ createPreference ~ body:", body);

        return this.mercadopagoService.createPreference(body);
    }

    @Post()
    async listenEvents(@Body() body: any) {
        console.log("��� ~ PagosMpController ~ listenEvents ~ body:", body);
        this.mercadopagoService.listenEvents(body);
    }

    @Get('payments/:payment_id')
    async getPaymentDetails(@Param('payment_id') paymentId: string) {
        console.log("🚀 ~ MercadopagoController ~ getPaymentDetails ~ paymentId:", paymentId)
        return this.mercadopagoService.getPaymentDetails(paymentId);
    }

    @Get('payments/search')
    async getPayments() {
        return this.mercadopagoService.searchPayment();
    }
}
