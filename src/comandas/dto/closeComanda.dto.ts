import { IsBoolean } from 'class-validator';

export class CloseComandaDto {
  @IsBoolean()
  isPaymentPending: boolean;
}
