import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // 2 parameter diatas sub dan email dapat dari function signToken di authService, yang kita set jwt.sign cuma sub dan email
    // jadi jwt strategy ini kaya kita bikin middleare authenticate di express jadi akan buat req.user. kalau endpoint nge hit api yang udah useGuard maka akan otomatis nge run finction validate ini,
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      }, // if the user not found the nest will otomaticaly return 401, gg
    });
    delete user.hash; // delete return hasnya saja
    return user; // kalau di set misal return "hi", maka jika kita console.log dari controller req.user nya maka datanya hanya hi
  }
}
