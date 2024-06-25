import { IsArray, ValidateNested } from 'class-validator';
import { PermissionDto } from './rolesCreate.dto';

export class addPermissionToRoleDto {
  @IsArray()
  @ValidateNested({ each: true })
  permissions: PermissionDto[];
}
