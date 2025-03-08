import { IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IItem } from "../interfaces/Item.interface";
import { IBackUrlsPreference } from "../interfaces/BackUrls.interface";

export class BackUrlsPreferenceDto implements IBackUrlsPreference {
   
    @IsNotEmpty()
    @IsString()
    success: string;

    @IsNotEmpty()
    @IsString()
    failure: string;

    @IsOptional()
    @IsString()
    pending?: string;

}