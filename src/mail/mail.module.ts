import { Module } from '@nestjs/common'
import { MailController } from './mail.controller'
import { MailService } from './mail.service'
import { ConfigService } from '@nestjs/config'

@Module({
  controllers: [MailController],
  providers: [MailService, ConfigService],
})
export class MailModule {}
