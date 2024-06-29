import { IsOptional, IsInt, IsPositive, IsEnum } from 'class-validator';
import { EStatusComanda } from 'src/entities/comandas.entity';

enum ESort {
  ASC = 'asc',
  DESC = 'desc',
}

export class ComandasGetQueryDto {
  @IsOptional()
  @IsEnum(ESort)
  sort?: `${ESort}` = ESort.ASC;

  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  offset?: number = 0;

  @IsOptional()
  @IsEnum(EStatusComanda)
  status?: `${EStatusComanda}`;
}
