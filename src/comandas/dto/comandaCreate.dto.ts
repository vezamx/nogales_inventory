import { IsNumber, IsPositive } from 'class-validator';

export class ComandaCreateDto {
  @IsNumber()
  @IsPositive()
  comensales: number;
}
