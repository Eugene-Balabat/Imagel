import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { AuthGuard } from 'src/auth/auth.guard'
import { ImageService } from './image.service'
import { UserRequestParams } from './requests/user.param'
import { User } from 'src/decorators/user.decorator'
import { UserEntity } from 'src/models/user.model'

@Controller('/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserImages(@User() user: UserEntity) {
    return this.imageService.getAllUserImages(user.id)
  }

  @UseGuards(AuthGuard)
  @Get('/all')
  async getAllImages() {
    return this.imageService.getAllImages()
  }

  @UseGuards(AuthGuard)
  @Post('/save')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`)
        },
      }),
    }),
  )
  async saveImage(@UploadedFile() file: Express.Multer.File, @User() user: UserEntity) {
    await this.imageService.saveImageToDB(user.id, file.filename)
  }
}
