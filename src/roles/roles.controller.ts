import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RolesCreateDto } from './dto/rolesCreate.dto';
import { RolesService } from './roles.service';
import { AuthGuard } from '../guards/authentication.guard';
import { addPermissionToRoleDto } from './dto/rolesUpdate.dto';
import { TransactionsInterceptor } from '../interceptors/transactions.interceptor';
import { NotTransactable } from '../decorators/notTransactable.decorator';

@UseInterceptors(TransactionsInterceptor)
@UseGuards(AuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @NotTransactable()
  @Get('/')
  async find() {
    return this.rolesService.find();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post('/')
  async create(@Body() data: RolesCreateDto) {
    return this.rolesService.create(data);
  }

  @Patch('/:id')
  async addPermissionToRole(
    @Param('id') id: string,
    @Body() { permissions }: addPermissionToRoleDto,
  ) {
    return this.rolesService.addPermissionToRole(id, permissions);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}
