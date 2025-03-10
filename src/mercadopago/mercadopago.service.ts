import { Injectable } from '@nestjs/common';
import { CreatePreferenceCheckoutPro } from './dto/CreatePreferenceCheckoutProDto';
import { createId } from '@paralleldrive/cuid2';
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';
import { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import MercadoPagoConfig, { Preference, Payment } from 'mercadopago';
import { PaymentGetData } from 'mercadopago/dist/clients/payment/get/types';
import { DatabaseService } from 'src/database/database.service';

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



type TPreferenceAG = {
    id: number;
    external_reference: string;
    id_materia: number;
    id_alumno: number;
    id_servicio: number;
    id_servicio_tipo: number;
    created_at: Date;
}
@Injectable()
export class MercadopagoService {
    client: MercadoPagoConfig;
    accessToken = 'APP_USR-1819459043832827-022615-69df729b62be9c09769cb69f8668113a-2292996564';

    constructor(private databaseService: DatabaseService){
        this.client = new MercadoPagoConfig({ accessToken: this.accessToken, options: {testToken: true, } });
    }

    async createPreference(preferenceData: CreatePreferenceCheckoutPro) {
        const uniqueID = createId()

        // const items = preferenceData.items.map((item) => {
        //     const {id, title, quantity, unit_price} = item;

        //     return {
        //         id,
        //         title,
        //         unit_price,
        //         quantity,

        //     }
        // });

        const items = preferenceData.items.map((item )=> item);

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
        console.log("🚀 ~ MercadoPagoService ~ returnnewPromise ~ response:", response);

        // console.log("🚀 ~ MercadopagoService ~ createPreference ~ externalReference:", externalReference)
        // console.log("🚀 ~ Mer", items[0].id_materia)
        // console.log("🚀 ~ Meraa", preferenceData.id_alumno)
        // console.log("🚀 ~ Merdaddd", items[0].id)

        // const responseDb = await this.databaseService.query(`
        //     INSERT INTO 
        //         escolar.tb_pp_preferences 
        //     (
        //         external_reference, 
        //         id_materia, 
        //         id_alumno, 
        //         id_servicio,
        //         created_at
        //     ) 
        //         values (?,?,?,?,?) 
                    
        // `, [externalReference, items[0].id_materia , preferenceData.id_alumno, items[0].id, new Date()]);
        // console.log("🚀 ~ MercadopagoService ~ createPreference ~ responseDb:", responseDb)

        items.forEach(async (item,index)=> {
            console.log("🚀 ~ MercadopagoService ~ items.forEach ~ item:", item);
            console.log('preferenceData.id_alumno', preferenceData.id_alumno)
            console.log('external reference', externalReference);

            const response = await this.databaseService.query(`
        
                INSERT INTO 
                    escolar.tb_pp_preferences 
                (
                    external_reference, 
                    id_materia, 
                    id_alumno, 
                    id_servicio,
                    created_at
                ) 
                    values
                (?,?,?,?,?) 
                        
            `, [externalReference, item.id_materia, preferenceData.id_alumno, item.id, new Date()]);

            console.log("🚀 ~ MercadopagoService ~ items.forEach ~ response:", response)
        });

        return response;
    }

    async listenEvents(body: TEvent) {


        if(body.type == 'payment'){
            if(body.action == 'payment.created'){
                const payment = await this.getPaymentDetails(body.data.id);
                console.log("🚀 ~ MercadopagoService ~ listenEvents ~ payment:", payment)
                
                if(payment.status == 'approved'){
                    //guardar payment en la base de datos en tabla tb_pagos

                    //necesito primero consultar en la tb_pp_preferences 
                    //el external reference del pago para saber que materia se va a habilitar o 
                    // en caso de examen que examen se habilita
                    const preferences: Array<TPreferenceAG> = await this.databaseService
                        .query(`
                            SELECT * from tb_pp_preferences WHERE external_reference = ?`, 
                            [payment.external_reference]
                        );

                    preferences.forEach((preference, index) => {
                        // Ejecutar la accion segun el caso 
                        // por ejemplo activacion de extraordinario
                        switch (preference.id_servicio_tipo) {

                            // INSCRIPCIÓN ANUAL
                            case 2:
                                    console.log("se ha realizado la inscripcion");
                                break;
                            
                            // CARGA DE MATERIA
                            case 3:
                                    console.log("se ha realizado la carga de materia")
                                break;

                            // ACTIVACION EXTRAORDINARIO
                            case 12:
                                    console.log("se ha realizado la activacion de extraordinario")
                                break;
                            
                            default:
                                break;
                        } 
                    });
                    
                    //

                }
                // return payment;
            }

            // if(body.action == ''){

            // }

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
