import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
// import { IItem } from "../interfaces/Item.interface";
import { Items } from "mercadopago/dist/clients/commonTypes";

export class ItemPreferenceDto implements Items {

    @ApiProperty({
        example: "123",
        description: "ID de producto es el id del servicio.",
    })
    @IsString()
    @IsNotEmpty()
    id: string;
   
    @ApiProperty({
        example: "Examen extraordinario",
        description: "Es el nombre del servicio",
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 350.00,
        description: "Precio del servicio",
    })
    @IsNumber()
    @IsNotEmpty()
    unit_price: number;

    @ApiProperty({
        example: 1,
        description: "Cantidad del servicio en este caso siempre es 1",
    })
    @IsInt()
    @IsNotEmpty()
    quantity: number = 1;


    @ApiProperty({
        example: 23,
        description: "ID de la materia NOTA: NO ID DE MOODLE",
    })
    @IsInt()
    @IsNotEmpty()
    id_materia: number;

    // @ApiProperty({
    //     example: 300,
    //     description: "ID del servicio",
    // })
    // @ApiProperty()
    // @IsInt()
    // @IsNotEmpty()
    // id_servicio: number;

    @ApiProperty({
        example: 12,
        description: "ID del tipo de servicio, por ejemplo 12 es de tipo extraordinario",
    })
    @IsInt()
    @IsNotEmpty()
    id_servicio_tipo: number;

}