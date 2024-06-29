import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class GirarDescuentoDto {
  @IsString()
  @IsNotEmpty()
  motivo: string;

  @IsNumber()
  @IsPositive()
  descuento: number;

  @IsBoolean()
  isPercentage: boolean;
}
