import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

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

    async getPagos(idAlumno: number) {
        try {
            
            const query = 'CALL escolar.sp_pp_payments_hist(?);';
            const response = await this.databaseService.query(query, [idAlumno]);
            console.log("🚀 ~ PagosService ~ getPagos ~ response:", response);
            const payments: Array<TPayment> = response[0];
            console.log("🚀 ~ PagosService ~ getPagos ~ payments:", payments)
            const items: Array<TItem> = response[1];
            console.log("🚀 ~ PagosService ~ getPagos ~ items:", items)
    
            const paymentsWithItems = payments.map((payment, index) => {
                const filteredItems = items.filter((itemFilter, index) => itemFilter.payment_id == payment.payment_id);
    
                return {
                    ...payment,
                    items: filteredItems
                }
            });
    
            return paymentsWithItems;
        } catch(err) {
            
        }
    }
}
