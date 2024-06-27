import { IsEnum, IsNumber } from 'class-validator';

enum InsumoOperacion {
  ADD = 'add',
  SUBSTRACT = 'substract',
  SET = 'set',
}

export class InsumoUpdateDto {
  @IsEnum(InsumoOperacion)
  operacion!: `${InsumoOperacion}`;

  @IsNumber()
  cantidad!: number;
}
