import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class ComandaCreateDto {
  @IsNumber()
  @IsPositive()
  comensales: number;

  @IsString()
  @IsNotEmpty()
  mesaId: string;
}
