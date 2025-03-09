import { Injectable } from '@nestjs/common';
import { CreatePreferenceCheckoutPro } from './dto/CreatePreferenceCheckoutProDto';
import { createId } from '@paralleldrive/cuid2';
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';
import { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import MercadoPagoConfig, { Preference, Payment } from 'mercadopago';
import { PaymentGetData } from 'mercadopago/dist/clients/payment/get/types';

type TEvent = {
    id: number,
    live_mode: boolean,
    type: string,
    date_created: string,
    user_id: number,
    api_version: string,
    action: string,
    data: any
}

type TPayment = {

}
@Injectable()
export class MercadopagoService {
    client: MercadoPagoConfig;
    accessToken = 'APP_USR-1819459043832827-022615-69df729b62be9c09769cb69f8668113a-2292996564';

    constructor(){
        this.client = new MercadoPagoConfig({ accessToken: this.accessToken, options: {testToken: true, } });
    }

    async createPreference(preferenceData: CreatePreferenceCheckoutPro) {
        const uniqueID = createId()

        const items = preferenceData.items.map((item) => {
            const {id, title, quantity, unit_price} = item;

            return {
                id,
                title,
                unit_price,
                quantity,
                
            }
        });

        const itemsReference = preferenceData.items.map(i => i.id ).join('-');
        const materiasReference = preferenceData.items.map(i => i.id_materia ).join('-');
        console.log("🚀 ~ MercadoPagoService ~ createPreference ~ uniqueID:", uniqueID)
        const externalReference = `${preferenceData.id_alumno}_${itemsReference}__${uniqueID}`;

        const preferenceRequestData: PreferenceRequest = {
            items,
            auto_return: preferenceData.auto_return,
            back_urls: preferenceData.back_urls,
            external_reference: externalReference,
        }

        const preferenceCreateData: PreferenceCreateData = {
            body: preferenceRequestData,
            requestOptions: {
                testToken: true, 
            }
        }

        const preference = new Preference(this.client);

        const response = await preference.create(preferenceCreateData);
        console.log("🚀 ~ MercadoPagoService ~ returnnewPromise ~ response:", response)
        return response;
    }

    async listenEvents(body: TEvent) {


        if(body.type == 'payment'){
            if(body.action == 'payment.created'){
                const payment = await this.getPaymentDetails(body.data.id);
                console.log("🚀 ~ MercadopagoService ~ listenEvents ~ payment:", payment)
                

                if(payment.status == 'approved'){
                    //guardar payment en la base de datos en tabla tb_pagos



                }
                // return payment;
            }

            if(body.action == ''){

            }

        }
        
    }

    async getPaymentDetails(paymentId: string) {
        
        console.log("🚀 ~ MercadopagoService ~ getPaymentDetails ~ paymentId:", paymentId);
        const payment = new Payment(this.client);
        // const requestOptions: PaymentGetData = {
        //     id: paymentId,
        //     requestOptions: {
        //         testToken: true,
        //         idempotencyKey: ''
        //     }
        // }
        const response = await payment.get({id: paymentId});
        return response;
    }

    async searchPayment(){
        console.log("��� ~ MercadopagoService ~ searchPayment ~ ");
        const payment = new Payment(this.client);
        const response = await payment.search({
            options: {
                
            },
            requestOptions: {
                testToken: true,
            }
        });
        return response;
    }
}
