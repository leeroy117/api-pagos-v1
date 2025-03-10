import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
// import { IItem } from "../interfaces/Item.interface";
import { Items } from "mercadopago/dist/clients/commonTypes";

export class ItemPreferenceDto implements Items {

    @IsString()
    @IsNotEmpty()
    id: string;
   
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    unit_price: number;

    @IsInt()
    @IsNotEmpty()
    quantity: number;

    @IsInt()
    @IsNotEmpty()
    id_materia: number;

    @IsInt()
    @IsNotEmpty()
    id_servicio: number;

    @IsInt()
    @IsNotEmpty()
    id_servicio_tipo: number;

}