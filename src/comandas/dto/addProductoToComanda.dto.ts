import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddProductoToComandaDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  productos: string[];
}
