import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  validate(payload: any) {
    // jadi jwt strategy ini kaya kita bikin middleare authenticate di express jadi akan buat req.user. kalau endpoint nge hit api yang udah useGuard maka akan otomatis nge run finction validate ini,
    return payload; // kalau di set misal return "hi", maka jika kita console.log dari controller req.user nya maka datanya hanya hi
  }
}
