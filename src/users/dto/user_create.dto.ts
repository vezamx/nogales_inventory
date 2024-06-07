import { IsString } from 'class-validator';

export class UserCreateDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  role: string;
}
