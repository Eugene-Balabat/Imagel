import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { ImageService } from './image.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(AuthGuard)
  @Post('/save')
  @UseInterceptors(FileInterceptor('image'))
  async saveImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
    return true
  }
}
