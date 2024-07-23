import { IsNotEmpty, IsString } from 'class-validator';

export class UnirComandasDto {
  @IsString()
  @IsNotEmpty()
  comandaId: string;

  @IsString()
  @IsNotEmpty()
  comandaIdToJoin: string;
}
