import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePreferenceCheckoutPro } from './dto/CreatePreferenceCheckoutProDto';
import { createId } from '@paralleldrive/cuid2';
import { PreferenceRequest, PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';
import { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import MercadoPagoConfig, { Preference, Payment } from 'mercadopago';
import { PaymentGetData } from 'mercadopago/dist/clients/payment/get/types';
import { DatabaseService } from 'src/database/database.service';
import { log } from 'console';

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
    accessToken = 'APP_USR-685231143478605-032716-fc9650b6eed0a8ea2ade09f8978ca9ef-2325182738';

    constructor(private databaseService: DatabaseService){
        this.client = new MercadoPagoConfig({ accessToken: this.accessToken, options: {timeout: 5000 } });
    }

    async createPreference(preferenceData: CreatePreferenceCheckoutPro) {
        const uniqueID = createId();

        const items = preferenceData.items.map((item )=> item);

        const itemsReference = preferenceData.items.map(i => i.id ).join('-');
        const materiasReference = preferenceData.items.map(i => i.id_materia ).join('-');
        console.log("🚀 ~ MercadoPagoService ~ createPreference ~ uniqueID:", uniqueID)
        const externalReference = `${preferenceData.id_alumno}_${uniqueID}`;

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

        const response: PreferenceResponse = await preference.create(preferenceCreateData);
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
        console.log("🚀 ~ MercadopagoService ~ listenEvents ~ body:", body)
        // setTimeout(async () => {
            try {
                if(body.type == 'payment'){
                    if(body.action == 'payment.created' || body.action == 'payment.updated') {
                        const paymentIdNotification: string = body.data.id;
                        const payment = await this.getPaymentDetails(parseInt(paymentIdNotification) );
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
                        // regresa id payment para usarlo en sp_pp_pago_insert
                        const queryInsertPayment = `CALL escolar.sp_pp_payments_insert(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                        const response = await this.databaseService.query(queryInsertPayment, [
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
                            new Date(payment.date_created || '').toISOString().slice(0, 19).replace("T", " "),
                            new Date(payment.date_last_updated || '').toISOString().slice(0, 19).replace("T", " "),
                            new Date(payment.date_approved || '').toISOString().slice(0, 19).replace("T", " "),
                        ]);
                        console.log("🚀 ~ MercadopagoService ~ listenEvents ~ response: response insert Payment,,,,", response);
                        const paymentIDAG = response[0][0].id_pp_payment;
                        console.log("🚀 ~ MercadopagoService ~ listenEvents ~ paymentIDAG:", paymentIDAG)
        
                        // insertar items en payments_items de MP
                        items?.forEach(async(item, index) => {
                            const pi = preferencesItems.find(pi => pi.id_servicio == parseInt(item.id));
                            // IN _id_alumno BIGINT, 
                            // IN _id_servicio BIGINT, 
                            // IN _id_materia BIGINT, 
                            // IN _id_servicio_tipo BIGINT,  
                            // IN _payment_id BIGINT, 
                            // IN _title VARCHAR(255), 
                            // IN _unit_price decimal(8,2), 
                            // IN _quantity INT, 
                            // IN _created_at VARCHAR(20)
                            const queryInsertItemsPayment = `CALL escolar.sp_pp_item_insert(?,?,?,?,?,?,?,?,?);`;
                            const responseInsertItems = await this.databaseService.query(queryInsertItemsPayment, [
                                idAlumno,
                                item.id,
                                pi?.id_materia,
                                pi?.id_servicio_tipo,
                                payment.id,
                                item.title,
                                item.unit_price,
                                item.quantity,
                                new Date(payment.date_created || '').toISOString().slice(0, 19).replace("T", " "),
                            ]);
                            console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertItems:", responseInsertItems)
                        });
        
                        
                        if(payment.status == 'approved') {
        
                            items?.forEach(async (item, index) => {
                                const pi = preferencesItems.find(pi => pi.id_servicio == parseInt(item.id));
                                //guardar payment en la base de datos en tabla tb_pagos
                                // sp_pp_pago_insert
                                // IN _id_pp_payment BIGINT, 
                                // IN _id_alumno BIGINT, 
                                // IN _id_servicio BIGINT, 
                                // IN _id_servicio_tipo BIGINT, 
                                // IN _unit_price decimal(8,2), 
                                // IN _date_approved VARCHAR(20)
                                const queryInsertPaymentAG = `CALL escolar.sp_pp_pago_insert(?,?,?,?,?,?);`;
                                const responseInsertPagoAG = await this.databaseService.query(queryInsertPaymentAG, [
                                    paymentIDAG,
                                    idAlumno,
                                    item.id,
                                    pi?.id_servicio_tipo,
                                    item.unit_price,
                                    new Date(payment.date_approved || '').toISOString().slice(0, 19).replace("T", " "),
                                ]);
                                console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertPagoAG:", responseInsertPagoAG)
        
                                switch(pi?.id_servicio_tipo) {
                                    // Inscripcion
                                    case 2:
                                            console.log("se ha realizado la inscripcion");
                                        break;
    
                                    // Carga materia
                                    case 3:
                                            // IN _id_alumno BIGINT, 
                                            // IN _id_materia BIGINT
                                            const responseCargaMateria = await this.databaseService.query(`
                                                CALL escolar.sp_pp_servicio_carga(?,?);`, [
                                                idAlumno,
                                                pi.id_materia,
                                            ]);
                                            console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseCargaMateria:", responseCargaMateria)
                                            console.log("se ha realizado la carga de materia");
                                    break;
    
                                    // Certificado 
                                    case 5: 
                                            const responseInsertDocsCECertificado = await this.databaseService.query(`
                                                CALL escolar.sp_pp_servicio_doc_ce(?,?);`, [paymentIDAG, idAlumno]);
                                            console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertDocsCECertificado:", responseInsertDocsCECertificado)
    
                                            console.log("se ha registrado el certificado ");
                                        break;
    
                                         // constancia
                                    case 6: 
                                         const responseInsertDocsCEConstancia = await this.databaseService.query(`
                                             CALL escolar.sp_pp_servicio_doc_ce(?,?);`, [paymentIDAG, idAlumno]);
                                         console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertDocsCEConstancia:", responseInsertDocsCEConstancia)
    
                                    break;
    
                                    // kardex
                                    case 7: 
                                            const responseInsertDocsCEKardex = await this.databaseService.query(`
                                            CALL escolar.sp_pp_servicio_doc_ce(?,?);`, [paymentIDAG, idAlumno]);
                                            console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertDocsCEKardex:", responseInsertDocsCEKardex)
                                    break;
                                    
                                    // Extraordinario
                                    case 12:
                                            // IN _id_alumno BIGINT, 
                                            // IN _id_materia BIGINT
                                            const responseExtraordinario = await this.databaseService.query(`
                                                CALL escolar.sp_pp_servicio_extraordinario(?,?);`, [
                                                idAlumno,
                                                pi.id_materia,
                                            ]);
                                            console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseExtraordinario:", responseExtraordinario);
                                            console.log("se ha realizado el pago de extraordinario");
                                        break;
    
                                    // CREDENCIAL
                                    case 13: 
                                            console.log("se ha registrado la Credencial de estudiante");
                                            const responseInsertDocsCECredencial = await this.databaseService.query(`
                                                CALL escolar.sp_pp_servicio_doc_ce(?,?);`, [paymentIDAG, idAlumno]);
                                            console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertDocsCECredencial:", responseInsertDocsCECredencial)
                                        break;
        
                                    default:
                                            console.log('default switch');
                                        break;
                                }
                            });
                            
        
                        }
                        // return payment;
                    }
        
                    // if(body.action == ''){
        
                    // }
        
                }
            }catch(e) {
                console.log('error__', e)
                throw new InternalServerErrorException(e)
            }

        // }, 5000)

        
        
    }



    async getPaymentDetails(paymentId: string | number) {
        try {
            console.log("🚀 ~ MercadopagoService ~ getPaymentDetails ~ paymentId:", paymentId);
            const payment = new Payment(this.client);
            // const requestOptions: PaymentGetData = {
            //     id: paymentId,
            //     requestOptions: {
            //         testToken: true,
            //         idempotencyKey: ''
            //     }
            // }
            const response = await payment.get({id: paymentId, requestOptions: { timeout: 15000 }});
            return response;
            
        } catch (error) {
            console.log("🚀 ~ MercadopagoService ~ getPaymentDetails ~ error_____:", error)
            throw new InternalServerErrorException("Error al obtener payment details");
            // return null;
        }
    }

    async searchPayment(externalReference: string){
        try {
            console.log("🚀 ~ MercadopagoService ~ searchPayment ~ externalReference:", externalReference)
            const payment = new Payment(this.client);
    
            const response = await payment.search(
                {
                options: {
                    sort: 'date_approved',
                    criteria: 'desc',
                    external_reference: externalReference,
                    // range: '',
                    begin_date: 'NOW-30DAYS',
                    end_date: 'NOW',
    
                },
                requestOptions: {
                    // testToken: true,
                    timeout: 15000
    
                }
            });
            console.log("🚀 ~ MercadopagoService ~ searchPayment ~ response:", response)
            return response;
            
        } catch (error) {
            console.log("🚀 ~ MercadopagoService ~ searchPayment ~ error:", error)
            throw new InternalServerErrorException("Error al buscar pago en MercadoPago");
        }
        // return setTimeout(async () => {
            
        // }, 5000)
    }

    async fallbackPayment(externalReference: string){
        // jona me envia el external reference para checar si existe en la base de datos

        const responsePaymentDB = await this.databaseService
                                    .query(`select * from tb_pp_payments where external_reference = ?`, [externalReference]);

        // si existe, devuelve el pago
        if(responsePaymentDB.length > 0){
            // existe el pago en la base de datos
            return responsePaymentDB[0];
        }

        // si no existe, consulta en mercado pago el pago
        const paymentsResponse = await this.searchPayment(externalReference);
        
        if(paymentsResponse.results?.length == 0){
            throw new NotFoundException("Pago no encontrado en MercadoPago");
        }

        if(typeof paymentsResponse.results == 'undefined'){
            throw new InternalServerErrorException("Ocurrio un error al consultar en MercadoPago");
        }
        
        // sino existe crea el pago basado en lainfo consultada de mercado pago

        // if(body.action == 'payment.created') {
            // const payment = await this.getPaymentDetails(body.data.id);
            const payment = paymentsResponse.results[0];

            console.log("🚀 ~ MercadopagoService ~ listenEvents ~ payment:", payment)
            
            const preferencesItems: Array<TPreferenceAG> = await this.databaseService
                    .query(`
                        SELECT * FROM tb_pp_preferences WHERE external_reference = ?`, 
                        [payment.external_reference]
                    );

            // insertar pago en payments y payments_items de MP 
            const items = payment.additional_info?.items;
            // const externalReference = payment.external_reference || '';
            const idAlumno =  externalReference.slice(0, externalReference.indexOf("_"));

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
            // regresa id payment para usarlo en sp_pp_pago_insert
            const queryInsertPayment = `CALL escolar.sp_pp_payments_insert(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            const response = await this.databaseService.query(queryInsertPayment, [
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
                new Date(payment.date_created || '').toISOString().slice(0, 19).replace("T", " "),
                new Date(payment.date_last_updated || '').toISOString().slice(0, 19).replace("T", " "),
                new Date(payment.date_approved || '').toISOString().slice(0, 19).replace("T", " "),
            ]);
            console.log("🚀 ~ MercadopagoService ~ listenEvents ~ response: response insert Payment,,,,", response);
            const paymentIDAG = response[0][0].id_pp_payment;
            console.log("🚀 ~ MercadopagoService ~ listenEvents ~ paymentIDAG:", paymentIDAG)
            console.log("itemssssss....", items);
            console.log('payment_____ID:', payment.id);
            
            // insertar items en payments_items de MP
            items?.forEach(async(item, index) => {
                const pi = preferencesItems.find(pi => pi.id_servicio == parseInt(item.id));
                // IN _id_alumno BIGINT, 
                // IN _id_servicio BIGINT, 
                // IN _id_materia BIGINT, 
                // IN _id_servicio_tipo BIGINT,  
                // IN _payment_id BIGINT, 
                // IN _title VARCHAR(255), 
                // IN _unit_price decimal(8,2), 
                // IN _quantity INT, 
                // IN _created_at VARCHAR(20)
                const queryInsertItemsPayment = `CALL escolar.sp_pp_item_insert(?,?,?,?,?,?,?,?,?);`;
                const responseInsertItems = await this.databaseService.query(queryInsertItemsPayment, [
                    idAlumno,
                    item.id,
                    pi?.id_materia,
                    pi?.id_servicio_tipo,
                    payment.id,
                    item.title,
                    item.unit_price,
                    item.quantity,
                    new Date(payment.date_created || '').toISOString().slice(0, 19).replace("T", " "),
                ]);
                console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertItems:", responseInsertItems)
            });

            
            if(payment.status == 'approved') {

                items?.forEach(async (item, index) => {
                    const pi = preferencesItems.find(pi => pi.id_servicio == parseInt(item.id));
                    //guardar payment en la base de datos en tabla tb_pagos
                    // sp_pp_pago_insert
                    // IN _id_pp_payment BIGINT, 
                    // IN _id_alumno BIGINT, 
                    // IN _id_servicio BIGINT, 
                    // IN _id_servicio_tipo BIGINT, 
                    // IN _unit_price decimal(8,2), 
                    // IN _date_approved VARCHAR(20)
                    const queryInsertPaymentAG = `CALL escolar.sp_pp_pago_insert(?,?,?,?,?,?);`;
                    const responseInsertPagoAG = await this.databaseService.query(queryInsertPaymentAG, [
                        paymentIDAG,
                        idAlumno,
                        item.id,
                        pi?.id_servicio_tipo,
                        item.unit_price,
                        new Date(payment.date_approved || '').toISOString().slice(0, 19).replace("T", " "),
                    ]);
                    console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertPagoAG:", responseInsertPagoAG)

                    switch(pi?.id_servicio_tipo) {
                        // Inscripcion
                        case 2:
                                console.log("se ha realizado la inscripcion");
                            break;

                        // Carga materia
                        case 3:
                                // IN _id_alumno BIGINT, 
                                // IN _id_materia BIGINT
                                const responseCargaMateria = await this.databaseService.query(`
                                    CALL escolar.sp_pp_servicio_carga(?,?);`, [
                                    idAlumno,
                                    pi.id_materia,
                                ]);
                                console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseCargaMateria:", responseCargaMateria)
                                console.log("se ha realizado la carga de materia");
                        break;

                        // Certificado 
                        case 5: 
                                const responseInsertDocsCECertificado = await this.databaseService.query(`
                                    CALL escolar.sp_pp_servicio_doc_ce(?,?);`, [paymentIDAG, idAlumno]);
                                console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertDocsCECertificado:", responseInsertDocsCECertificado)

                                console.log("se ha registrado el certificado ");
                            break;

                             // constancia
                        case 6: 
                             const responseInsertDocsCEConstancia = await this.databaseService.query(`
                                 CALL escolar.sp_pp_servicio_doc_ce(?,?);`, [paymentIDAG, idAlumno]);
                             console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertDocsCEConstancia:", responseInsertDocsCEConstancia)

                        break;

                        // kardex
                        case 7: 
                                const responseInsertDocsCEKardex = await this.databaseService.query(`
                                CALL escolar.sp_pp_servicio_doc_ce(?,?);`, [paymentIDAG, idAlumno]);
                                console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertDocsCEKardex:", responseInsertDocsCEKardex)
                        break;
                        
                        // Extraordinario
                        case 12:
                                // IN _id_alumno BIGINT, 
                                // IN _id_materia BIGINT
                                const responseExtraordinario = await this.databaseService.query(`
                                    CALL escolar.sp_pp_servicio_extraordinario(?,?);`, [
                                    idAlumno,
                                    pi.id_materia,
                                ]);
                                console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseExtraordinario:", responseExtraordinario);
                                console.log("se ha realizado el pago de extraordinario");
                            break;

                        // CREDENCIAL
                        case 13: 
                                console.log("se ha registrado la Credencial de estudiante");
                                const responseInsertDocsCECredencial = await this.databaseService.query(`
                                    CALL escolar.sp_pp_servicio_doc_ce(?,?);`, [paymentIDAG, idAlumno]);
                                console.log("🚀 ~ MercadopagoService ~ items?.forEach ~ responseInsertDocsCECredencial:", responseInsertDocsCECredencial)
                            break;

                        default:
                                console.log('default switch');
                            break;
                    }
                });
                

            }
            // return payment;
        // }

    }
}
