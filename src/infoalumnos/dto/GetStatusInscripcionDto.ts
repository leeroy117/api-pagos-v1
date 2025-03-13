
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
// import { ItemPreferenceDto } from './ItemPreferenceDto';
import { Type } from 'class-transformer';
// import { BackUrlsPreferenceDto } from './BackUrlsPreferenceDto';
import { ApiProperty } from '@nestjs/swagger';


export class GetStatusInscripcionDto  {
   
    @ApiProperty({
        isArray: false, 
        description: 'Inscripción mensual id=4 e Inscripción anual id = 2',
        examples: [{tipo_inscripcion: 2}, {tipo_inscripcion: 4}]
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    id_tipo_inscripcion: number;

    @ApiProperty({
        isArray: false, 
        description: 'ID de Alumno',
        examples: [{tipo_inscripcion: 2}, {tipo_inscripcion: 4}]
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    id_alumno: number;

}