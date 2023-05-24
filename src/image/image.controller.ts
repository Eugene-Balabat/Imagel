import { Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors, Get } from '@nestjs/common'
import { ImageService } from './image.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { IsNumberString } from 'class-validator'

class UserRequestParams {
  @IsNumberString()
  userId: string
}

@Controller('/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(AuthGuard)
  @Get('/:userId')
  async getUserImages(@Param() params: UserRequestParams) {
    return await this.imageService.getAllUserImages(params.userId)
  }

  @UseGuards(AuthGuard)
  @Post('/save/:userId')
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
