
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ItemPreferenceDto } from './ItemPreferenceDto';
import { Type } from 'class-transformer';
import { BackUrlsPreferenceDto } from './BackUrlsPreferenceDto';


export class CreatePreferenceCheckoutPro  {
   
   @ValidateNested()
   @Type(() => ItemPreferenceDto)
   items: ItemPreferenceDto[];

   @IsNotEmpty()
   @Type(() => BackUrlsPreferenceDto)
   back_urls: BackUrlsPreferenceDto;

   @IsIn(['approved'])
   auto_return: string;

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