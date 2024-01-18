import { Global, Module } from "@nestjs/common"
import { PrismaService } from "./prisma.service"

@Global() // global agar service prisma itu bisa di akses ke semua tanpa repot2 import2 lagi
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
