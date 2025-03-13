
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ItemPreferenceDto } from './ItemPreferenceDto';
import { Type } from 'class-transformer';
import { BackUrlsPreferenceDto } from './BackUrlsPreferenceDto';
import { ApiProperty } from '@nestjs/swagger';
import { PreferenceRequest, PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';
import { ResponseFields } from 'mercadopago/dist/types';


export class PreferenceResponseDto implements PreferenceResponse {
   
   api_response: ResponseFields;

}