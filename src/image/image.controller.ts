import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { AuthGuard } from 'src/auth/auth.guard'
import { ImageService } from './image.service'
import { UserRequestParams } from './requests/user.param'

@Controller('/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(AuthGuard)
  @Get('/:userId')
  async getUserImages(@Param() params: UserRequestParams) {
    return this.imageService.getAllUserImages(params.userId)
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
  async saveImage(@UploadedFile() file: Express.Multer.File, @Param() params: UserRequestParams) {
    await this.imageService.saveImageToDB(params.userId, file.filename)
  }
}
