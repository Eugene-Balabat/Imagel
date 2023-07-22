import { RedisModule } from '@liaoliaots/nestjs-redis'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as path from 'path'
import { AuthModule } from './auth/auth.module'
import { ImageModule } from './image/image.module'
import { MailModule } from './mail/mail.module'
import { ImageEntity } from './models/image.model'
import { UserEntity } from './models/user.model'

@Module({
  imports: [
    AuthModule,
    ImageModule,
    MailModule,
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
        host: process.env.PG_HOST || configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT_DOCKER'),
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
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: __dirname + '/mail/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        config: {
          host: process.env.REDIS_HOST || configService.get('HOST'),
          port: configService.get('PORT'),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
