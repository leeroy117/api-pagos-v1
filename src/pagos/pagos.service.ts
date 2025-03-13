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
            const payments: Array<TPayment> = response[0];
            const items: Array<TItem> = response[1];
            const total: number = response[2][0].total; 
    
            const paymentsWithItems = payments.map((payment, index) => {
                const filteredItems = items.filter((itemFilter, index) => itemFilter.payment_id == payment.payment_id);
    
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
