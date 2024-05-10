import { IsEnum, IsNumber } from 'class-validator';

export class InsumoUpdateDto {
  @IsEnum(['add', 'substract', 'set'])
  operacion!: string;

  @IsNumber()
  cantidad!: number;
}
