import { IsString } from 'class-validator';

export class MesaCreateDto {
  @IsString()
  nombre: string;

  @IsString()
  seccion: string;
}
