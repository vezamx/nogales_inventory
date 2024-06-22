import { SetMetadata } from '@nestjs/common';

export const NotTransactable = () => SetMetadata('notTransactable', true);
