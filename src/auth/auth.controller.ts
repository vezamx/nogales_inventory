import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/token/:idEmpleado')
  async generateToken(@Param('idEmpleado') idEmpleado: string) {
    return await this.authService.generateToken(idEmpleado);
  }
}
