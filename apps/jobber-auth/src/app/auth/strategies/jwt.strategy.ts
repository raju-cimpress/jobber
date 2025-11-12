import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { User } from '../../users/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJwt]),
      secretOrKey: configService.getOrThrow('AUTH_JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  private static extractJwt(request: any): string | null {
    console.log('Extracting JWT from Request');
    if (request.cookies) {
      console.log(request.cookies);
      return request.cookies?.Authentication;
    }
    console.log(request);
    if (request.token) {
      return request.token;
    }
    return null;
  }

  async validate(payload: JwtPayloadDto): Promise<User> {
    const { userId } = payload;
    const user: User = await this.usersService.getUser({ id: userId });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
