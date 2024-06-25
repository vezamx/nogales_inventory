import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  EPermissionAction,
  EPermissionContext,
  TPermissionAction,
  TPermissionContext,
} from '../../utils/types';

export class RolesCreateDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  permissions?: PermissionDto[];
}

export class PermissionDto {
  @IsEnum(EPermissionContext)
  context: TPermissionContext;

  @IsEnum(EPermissionAction)
  action: TPermissionAction;
}
