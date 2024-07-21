import { IsArray, ArrayMinSize } from 'class-validator';

export class ComandaDividirDto {
  @IsArray()
  @ArrayMinSize(1)
  productosIds: string[];
}
