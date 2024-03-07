import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserEntity } from '../users/entities/user.entity';
import { AuthUser } from '../auth/decorators';
import { UserRole } from 'src/utils';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('ambassador-link')
  async generateAmbassadorInvLink(@AuthUser() user: UserEntity) {
    if (user.role !== UserRole.SuperAdmin && user.role !== UserRole.Admin)
      throw new UnauthorizedException();

    return this.adminService.generateAmbassadorInvLink(user);
  }
}
