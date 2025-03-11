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
                    id_servicio_tipo,
                    created_at
                ) 
                    values
                (?,?,?,?,?,?) 
                        
            `, [externalReference, item.id_materia, preferenceData.id_alumno, item.id, item.id_servicio_tipo, new Date()]);

            console.log("🚀 ~ MercadopagoService ~ items.forEach ~ response:", response)
        });

        return response;
    }

    async listenEvents(body: TEvent) {


        if(body.type == 'payment'){
            if(body.action == 'payment.created'){
                const payment = await this.getPaymentDetails(body.data.id);
                console.log("🚀 ~ MercadopagoService ~ listenEvents ~ payment:", payment)
                
                const preferencesItems: Array<TPreferenceAG> = await this.databaseService
                        .query(`
                            SELECT * FROM tb_pp_preferences WHERE external_reference = ?`, 
                            [payment.external_reference]
                        );

                // insertar pago en payments y payments_items de MP 
                const items = payment.additional_info?.items;
                const externalReference = payment.external_reference || '';
                const idAlumno =  externalReference.slice(0, externalReference.indexOf("_"));

                // await this.databaseService.query(`
                //         INSERT INTO 
                //             escolar.tb_pp_payments 
                //             (
                //                 payment_id,
                //                 external_reference,
                //                 status,
                //                 status_detail,
                //                 transaction_amount,
                //                 net_received_amount,
                //                 total_paid_amount,
                //                 payment_method_id,
                //                 payment_type_id
                //             )
                //             values 
                //             (
                //                 ?,?,?,?,?,?,?,?,?
                //             )`, [
                //                     payment.id, 
                //                     payment.external_reference, 
                //                     payment.status, 
                //                     payment.status_detail, 
                //                     payment.transaction_amount, 
                //                     payment.transaction_details?.net_received_amount, 
                //                     payment.transaction_details?.total_paid_amount, 
                //                     payment.payment_method_id, 
                //                     payment.payment_type_id
                //             ]);

                // IN _id_alumno BIGINT, 
                // IN _payment_id BIGINT, 
                // IN _external_reference VARCHAR(64), 
                // IN _status VARCHAR(50), 
                // IN _status_detail VARCHAR(50), 
                // IN _transaction_amount DECIMAL(8,2), 
                // IN _net_received_amount DECIMAL(8,2), 
                // IN _total_paid_amount DECIMAL(8,2), 
                // IN _payment_method_id VARCHAR(100), 
                // IN _payment_type_id VARCHAR(100), 
                // IN _date_created VARCHAR(20), 
                // IN _date_last_updated VARCHAR(20), 
                // IN _date_approved VARCHAR(20)

                // insertar payment cteado en la tabla de payments de mp
                const queryInsertPayment = `CALL escolar.sp_pp_payments_insert(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                this.databaseService.query(queryInsertPayment, [
                    idAlumno,
                    payment.id,
                    payment.external_reference,
                    payment.status,
                    payment.status_detail,
                    payment.transaction_amount,
                    payment.transaction_details?.net_received_amount,
                    payment.transaction_details?.total_paid_amount,
                    payment.payment_method_id,
                    payment.payment_type_id,
                    // payment.date_created,
                    new Date(),
                    payment.date_last_updated,
                    payment.date_approved,
                ])

                // insertar items en payments_items de MP
                items?.forEach((item, index) => {
                    const pi = preferencesItems.find(pi => pi.id_servicio == parseInt(item.id));
                    // IN _id_pp_payment BIGINT, 
                    // IN _id_alumno BIGINT, 
                    // IN _id_materia BIGINT,
                    // IN _id_servicio BIGINT, 
                    // IN _payment_id BIGINT, 
                    // IN _title VARCHAR(255), 
                    // IN _unit_price decimal(8,2), 
                    // IN _quantity INT, 
                    // IN _created_at VARCHAR(20)
                    const queryInsertItemsPayment = `CALL escolar.sp_pp_items_insert(?,?,?,?,?,?,?,?,?);`;
                    this.databaseService.query(queryInsertItemsPayment, [
                        payment.id,
                        idAlumno,
                        pi?.id_materia,
                        pi?.id_servicio,
                        payment.id,
                        item.title,
                        item.unit_price,
                        item.quantity,
                        payment.date_created
                    ]);
                });

                

                // items?.forEach(async (item, index) => {
                //     const pi = preferencesItems.find(pi => pi.id_servicio == parseInt(item.id));

                //     //insertar items en payments_items de MP
                //     await this.databaseService.query(`
                //         INSERT INTO
                //             escolar.tb_pp_payments_items
                //             (
                //                 payment_id,
                //                 id_servicio,
                //                 title,
                //                 unit_price,
                //                 quantity,
                //                 created_at,
                //                 id_materia,
                //                 id_servicio_tipo
                //             )
                //             values
                //             (
                //                 ?,?,?,?,?,?,?,?
                //             )
                //         `, [
                //             payment.id,
                //             item.id,    
                //             item.title,
                //             item.unit_price,
                //             item.quantity,
                //             new Date(),
                //             pi?.id_materia,
                //             pi?.id_servicio_tipo
                //         ]);
                // });
                
                if(payment.status == 'approved') {
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
