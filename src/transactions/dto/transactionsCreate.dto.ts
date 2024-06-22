import { IsString } from 'class-validator';

export class TransactionsCreateDto {
  @IsString()
  method: string;

  @IsString()
  url: string;

  @IsString()
  body: string;
}
