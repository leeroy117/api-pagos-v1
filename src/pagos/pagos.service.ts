import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GetPagosByAlumnoDto } from './dto/GetPagosByAlumnoDto';

type TItem = {
    payment_id: number,
    id_servicio: number,
    servicio: string;
    title: string;
    unit_price: string;
    quantity: number;
    id_materia: number;
    materia: string | null;
    id_servicio_tipo: number;
    servicio_tipo: string;
    created_at: Date;
}

type TPayment = {
    payment_id: number;
    title: string;
    total_paid_amount: string;
    payment_type_id: string;
    status: string;
    status_spanish: string;
    date_created: Date;
    date_approved: Date;
    items: TItem[];
}

type TDocCE = {
    id_estatus_docs_ce: number;
    payment_id: number;
    external_reference: string;
    title: string;
    id_servicio_tipo: number;
    id_servicio: number;
    id_materia: number;
    estatus: string;
    font_color: string;
    id: number;
  }

@Injectable()
export class PagosService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getPagos(data: GetPagosByAlumnoDto) {
        try {
            const {  limit, id_alumno: idAlumno, page } = data;
            console.log("🚀 ~ PagosService ~ getPagos ~ limit:", limit)
            console.log("🚀 ~ PagosService ~ getPagos ~ page:", page)
            console.log("🚀 ~ PagosService ~ getPagos ~ idAlumno:", idAlumno)

            const query = 'CALL escolar.sp_pp_payments_hist(?,?,?);';
            const response = await this.databaseService.query(query, [idAlumno, limit, page]);
            // console.log("🚀 ~ PagosService ~ getPagos ~ response:", response)
            const payments: Array<TPayment> = response[0];
            const items: Array<TItem> = response[1];
            const total: number = response[2][0].total; 
            const itemsDocsCE: Array<TDocCE> = response[3];
            console.log("🚀 ~ PagosService ~ getPagos ~ itemsDocsCE:", itemsDocsCE)
    
            const paymentsWithItems = payments.map((payment, index) => {
                const filteredItems = 
                    items.filter((itemFilter, index) => itemFilter.payment_id == payment.payment_id)
                    .map((item) => ({
                        ...item,
                        doc_ce_info: itemsDocsCE.find(doc => doc.id_servicio == item.id_servicio) ?? null
                    }));

    
                return {
                    ...payment,
                    items: filteredItems,
                }
            });
    
            // return paymentsWithItems;
            return {
                data: paymentsWithItems,
                total: total,
                currentPage: page,
                limit: limit,
                totalPages: Math.ceil(total / limit),
            }
            // return response;
        } catch(err) {
            console.log("🚀 ~ PagosService ~ getPagos ~ err:", err)
            throw new InternalServerErrorException();
        }
    }
}
