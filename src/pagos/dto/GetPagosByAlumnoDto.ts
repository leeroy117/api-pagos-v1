import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class GetPagosByAlumnoDto {
    
    @ApiProperty({
          example: 3000,
          description: 'ID del alumno,',
       })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    id_alumno: number;

    @ApiProperty({
        example: 1,
        description: 'Número de página deafult 1',
     })
    @IsOptional()
    @Type(() => Number) // Convierte el query param a número
    @IsNumber()
    @Min(1)
    page: number =1;

    @ApiProperty({
        example: 15,
        description: 'Número de resultados por página deafult 10',
     })
    @IsOptional()
    @Type(() => Number) // Convierte el query param a número
    @IsNumber()
    @Min(1)
    limit: number = 10;
}