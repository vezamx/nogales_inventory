import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProductosCreateDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion: string;

  @IsString()
  photo_path: string;

  @IsString()
  video_path: string;

  @IsNumber()
  costo: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  insumos: InsmoArray[];
}

export class InsmoArray {
  @IsString()
  id: string;

  @IsNumber()
  cantidad: number;
}
