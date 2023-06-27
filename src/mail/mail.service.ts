import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Options } from 'nodemailer/lib/smtp-transport'

@Injectable()
export class MailService implements OnModuleInit {
  constructor(private readonly configService: ConfigService, private readonly mailerService: MailerService) {}

  private readonly logger = new Logger(MailService.name)

  async onModuleInit() {
    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('EMAIL'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_SECRET'),
        refreshToken: this.configService.get('REFRESH_TOKEN'),
      },
    }

    this.mailerService.addTransporter('gmail', config)
  }

  async sendMail(code: number, email: string, firstName: string) {
    return this.mailerService.sendMail({
      to: email,
      transporterName: 'gmail',
      from: 'imagel.service@gmail.com',
      subject: 'Verification Code',
      template: 'confirmation',
      context: { code: code, name: firstName },
    })
  }
}
