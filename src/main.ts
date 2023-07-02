import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import zlib from 'zlib'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder().setTitle('Imagel').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))

  app.use(cookieParser())
  app.use(compression({ level: zlib.constants.Z_BEST_COMPRESSION, memLevel: zlib.constants.Z_MAX_MEMLEVEL }))

  await app.listen(3000)
}
bootstrap()
