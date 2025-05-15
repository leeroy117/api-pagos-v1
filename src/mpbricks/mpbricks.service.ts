import { Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import MercadoPagoConfig, { Payment, PaymentMethod, Preference } from 'mercadopago';
import { PaymentCreateData, PaymentCreateRequest } from 'mercadopago/dist/clients/payment/create/types';
import { PreferenceRequest, PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';
import { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import { DatabaseService } from 'src/database/database.service';
import { CreatePreferenceCheckoutPro } from 'src/mercadopago/dto/CreatePreferenceCheckoutProDto';

type TCreatePayment = {
    id_alumno: number,
    transaction_amount: number,
    payment_method: PaymentMethod,
    description: string,
    // id_tipo_inscripcion: number,
}
@Injectable()
export class MpbricksService {
        // client: MercadoPagoConfig;
        accessToken = 'APP_USR-685231143478605-032716-fc9650b6eed0a8ea2ade09f8978ca9ef-2325182738';
    
        constructor(private databaseService: DatabaseService){
            // this.client = new MercadoPagoConfig({ accessToken: this.accessToken, options: {timeout: 5000 } });
        }

        // async createPayment(preferenceData: CreatePreferenceCheckoutPro) {
        async createPayment(createPaymentRequest: TCreatePayment) {
            const client = new MercadoPagoConfig({ accessToken: this.accessToken, options: {timeout: 5000 }});
            // const items = preferenceData.items.map((item )=> item);

            const uniqueID = createId();
            const externalReference = `${createPaymentRequest.id_alumno}_${uniqueID}`;

            const payment = new Payment(client);

            // const preferenceRequestData: PaymentCreateRequest = {
            //     items,
            //     auto_return: preferenceData.auto_return,
            //     back_urls: preferenceData.back_urls,
            //     external_reference: externalReference,
            // }

            // const preferenceCreateData: PaymentCreateData = {
            //     body: preferenceRequestData,
            //     // requestOptions: {
            //     //     testToken: true,
            //     // }
            //     // body: preferenceRequestData,
            //     // requestOptions: {
            //     //     testToken: true, 
            //     // }
            // }

            payment.create({
                body:{
                    external_reference: externalReference,
                    transaction_amount: createPaymentRequest.transaction_amount,
                    payment_method_id: "visa",
                    // payment_type_id: "credit_card",
                    description: createPaymentRequest.description,
                    payer: {
                        email: 'leeroy.uziel.gg@outlook.es',
                        identification: {
                          number: '12345678909',
                          type: 'CPF',
                        },
                      },

                }
            })
        }
}
