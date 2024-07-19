import { IsString } from 'class-validator';

export class SeccionCreateDto {
  @IsString()
  nombre: string;
}
