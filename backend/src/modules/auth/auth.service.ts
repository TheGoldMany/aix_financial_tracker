import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@modules/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const saltRounds = parseInt(this.configService.get('BCRYPT_SALT_ROUNDS') || '12', 10);
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
    });

    // Initialize default categories for the user
    await this.usersService.initializeDefaultCategories(user.id);

    // Initialize savings account
    await this.usersService.initializeSavingsAccount(user.id);

    return this.login(user);
  }

  async login(user: any): Promise<LoginResponseDto> {
    const payload = { sub: user.id, email: user.email, isPro: user.isPro };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '30d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isPro: user.isPro,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid token');
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { expiresIn: '1h' },
    );

    await this.usersService.setResetPasswordToken(user.id, resetToken);

    // TODO: Send email with reset link
    // For now, just log it
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'password-reset') {
        throw new BadRequestException('Invalid token');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user || user.resetPasswordToken !== token) {
        throw new BadRequestException('Invalid or expired token');
      }

      const saltRounds = parseInt(this.configService.get('BCRYPT_SALT_ROUNDS') || '12', 10);
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      await this.usersService.updatePassword(user.id, passwordHash);
      await this.usersService.clearResetPasswordToken(user.id);
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
