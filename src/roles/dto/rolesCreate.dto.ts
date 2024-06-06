import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class RolesCreateDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  permissions?: PermissionDto[];
}

class PermissionDto {
  @IsString()
  context: string;

  @IsString()
  action: string;
}
