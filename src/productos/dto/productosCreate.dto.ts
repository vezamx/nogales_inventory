import { IsNumber, IsOptional, IsString } from 'class-validator';

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
}
