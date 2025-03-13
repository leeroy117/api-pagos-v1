
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ItemPreferenceDto } from './ItemPreferenceDto';
import { Type } from 'class-transformer';
import { BackUrlsPreferenceDto } from './BackUrlsPreferenceDto';
import { ApiProperty } from '@nestjs/swagger';


export class CreatePreferenceCheckoutPro  {
   
   @ApiProperty({
      isArray: true, 
      example: [
         {
            id: "250",
            description: "Pago de examen extraordinario",
            title: "Examen Extraordinario",
            unit_price: 350.00,
            quantity: 1,
            id_materia: 200,
            id_servicio_tipo: 12 
         }
      ] 
   })
   @ValidateNested()
   @Type(() => ItemPreferenceDto)
   items: ItemPreferenceDto[];

   @ApiProperty({
      example: 
         {
            success: "https://tusitio.com/success",
            failure: "https://tusitio.com/failure",
            pending: "https://tusitio.com/pending"
         }
      
   })
   @IsNotEmpty()
   @Type(() => BackUrlsPreferenceDto)
   back_urls: BackUrlsPreferenceDto;

   @ApiProperty({
      example: "approved",
      description: "El autoreturn retorna automaticamente en 5 seg al alumno al sitio enviado en back_urls"
   })
   @IsIn(['approved'])
   auto_return: string;

   @ApiProperty({
      example: 3000,
      description: "ID del alumno para el cual se generó la preferencia"
   })
   @IsNotEmpty()
   @IsInt()
   id_alumno: number;

   // @IsNotEmpty()
   // @IsInt()
   // id_materia?: number;

   // @IsNotEmpty()
   // @IsInt()
   // id_servicio: number;

}