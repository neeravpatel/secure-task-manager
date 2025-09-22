import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto, AuthUser, LoginDto } from '@secure-task-manager/auth';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(Organization) private organizationsRepo: Repository<Organization>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const role = await this.rolesRepo.findOne({ where: { id: user.roleId } });
    const organization = await this.organizationsRepo.findOne({
      where: { id: role.organizationId },
    });

    return this.buildAuthResponse(user, role, organization);
  }

  private buildAuthResponse(user: User, role: Role, organization: Organization): AuthResponseDto {
    const userPayload: AuthUser = {
      id: user.id,
      email: user.email,
      role: role.name,
      roleId: role.id,
      organizationId: organization.id,
      organization: organization.name,
    };

    return {
      access_token: this.jwtService.sign(userPayload),
      user: userPayload,
    };
  }
}
