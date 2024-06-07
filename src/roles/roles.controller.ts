import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesCreateDto } from './dto/rolesCreate.dto';
import { RolesService } from './roles.service';
import { AuthGuard } from '../guards/authentication.guard';

@UseGuards(AuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

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

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}
