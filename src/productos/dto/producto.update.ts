import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductoUpdateDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  photo_path?: string;

  @IsString()
  @IsOptional()
  video_path?: string;

  @IsNumber()
  @IsOptional()
  costo?: number;
}
