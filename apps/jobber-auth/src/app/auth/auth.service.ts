import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';
import { compare } from 'bcryptjs';
import { UserLoginDto } from './dto/user-login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async login(
    { email, password }: UserLoginDto,
    response: Response
  ): Promise<User> {
    const user = await this.verifyUser(email, password);
    const expires = new Date(
      Date.now() +
        parseInt(this.configService.getOrThrow('AUTH_JWT_EXPIRATION_MS'))
    );
    const jwtPayload: JwtPayloadDto = {
      userId: user.id,
    };
    const accessToken = this.jwtService.sign(jwtPayload);
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires,
    });
    return user;
  }

  private async verifyUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.getUser({ email });
      const authenticated = await compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException('Credentials are not valid');
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }
}
