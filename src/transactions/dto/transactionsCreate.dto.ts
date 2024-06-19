import { IsArray, IsEnum, IsString } from 'class-validator';
import { EPermissionAction, EPermissionContext } from 'src/utils/types';

export class TransactionsCreateDto {
  @IsEnum(EPermissionAction)
  tipoTransaccion: `${EPermissionAction}`;

  @IsArray()
  @IsString({ each: true })
  elementosAfectados: string[];

  @IsEnum(EPermissionContext)
  contexto: `${EPermissionContext}`;
}
