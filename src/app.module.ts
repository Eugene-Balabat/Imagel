import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as path from 'path'
import { AuthModule } from './auth/auth.module'
import { ImageModule } from './image/image.module'
import { ImageEntity } from './models/image.model'
import { UserEntity } from './models/user.model'
import { ThrottlerModule } from '@nestjs/throttler'

@Module({
  imports: [
    AuthModule,
    ImageModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: 60,
        limit: configService.get<number>('REQUESTS_LIMIT'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        migrations: [path.join(__dirname, './migrations/**/*{.ts,.js}')],
        entities: [UserEntity, ImageEntity],
        synchronize: false,
        migrationsRun: true,
        cache: { duration: 1 },
        parseInt8: true,
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '2h' },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
