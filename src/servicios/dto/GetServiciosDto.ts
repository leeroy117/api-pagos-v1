import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class GetServiciosDto {
    
    @ApiProperty({
          example: 47,
          description: 'ID del plan de estudio',
       })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    id_plan_estudio: number;

}