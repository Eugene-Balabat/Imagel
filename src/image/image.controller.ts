import { Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { AuthGuard } from 'src/auth/auth.guard'
import { ImageService } from './image.service'
import { User } from 'src/decorators/user.decorator'
import { UserEntity } from 'src/models/user.model'
import { PaginationParams } from 'src/auth/requests/pagination.params'
import { ImageResponse } from './responses/image.response'

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
  async getAllImages(@Query() params: PaginationParams) {
    const imageData = await this.imageService.getAllImages(params)

    return imageData.map((image) => {
      return new ImageResponse(image)
    })
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
