import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { ImageController } from './image.controller'
import { ImageService } from './image.service'

@Module({
  imports: [MulterModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
