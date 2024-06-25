import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { tap } from 'rxjs/operators';
import { CustomRequest } from '../utils/types';

@Injectable()
export class TransactionsInterceptor implements NestInterceptor {
  constructor(private readonly TransactionsService: TransactionsService) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const req: CustomRequest = context.switchToHttp().getRequest();

    // get the metadabata to check if it is required to log the transaction
    const isNotTransactable = Reflect.getMetadata(
      'notTransactable',
      context.getHandler(),
    );
    const { method, url, body, user } = req;
    return next.handle().pipe(
      tap(async () => {
        if (isNotTransactable) {
          return;
        }
        await this.TransactionsService.create(
          {
            method,
            url,
            body: JSON.stringify(body),
          },
          user,
        );
      }),
    );
  }
}
