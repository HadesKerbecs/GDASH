import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // registro via /auth/register
  async register(dto: CreateUserDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('E-mail já está em uso');
    }

    const user = await this.usersService.create(dto);
    return user;
  }

  // login via /auth/login
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordOk = await bcrypt.compare(dto.password, user.password);
    if (!passwordOk) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
