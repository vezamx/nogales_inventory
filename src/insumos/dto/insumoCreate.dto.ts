import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EUnidadInsumo, TUnidadInsumo } from '../../entities/insumos.entity';

export class InsumoCreateDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion!: string;

  @IsEnum(EUnidadInsumo)
  unidad!: TUnidadInsumo;

  @IsNumber()
  cantidad!: number;
}
