import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { ImageController } from './image.controller'
import { ImageService } from './image.service'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'

@Module({
  imports: [MulterModule],
  controllers: [ImageController],
  providers: [
    ImageService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ImageModule {}
