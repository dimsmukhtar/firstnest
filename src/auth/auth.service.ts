import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    // generate password
    const hash = await argon.hash(dto.password);
    try {
      // save user to the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash; // delete return hashnya saja, tidak menghapus yang ada di dbnya

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // code P2002 itu khusus error code stand for prisma jika tambah data unique lagi
          throw new ForbiddenException(
            'Credentials Already taken, You cannot use that',
          ); // forbidedenExpection khusus dari nests js, wah keren juga nest js
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist throw exception us nest js guard
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password incorect throw exception
    if (!pwMatches) throw new ForbiddenException('Crendentials incorrect');
    delete user.hash; // ini delete return aja, ngga delete di dbnya
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
