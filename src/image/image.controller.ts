import { Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { AuthGuard } from 'src/auth/auth.guard'
import { PaginationParams } from 'src/auth/requests/pagination.params'
import { User } from 'src/decorators/user.decorator'
import { UserEntity } from 'src/models/user.model'
import { ImageService } from './image.service'
import { ImageResponse } from './responses/image.response'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as sharp from 'sharp'
import * as md5 from 'md5'

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
    return imageData.map((image) => new ImageResponse(image))
  }

  // Можно добавить валидацию на входящие файлы
  @UseGuards(AuthGuard)
  @Post('/image/save')
  @UseInterceptors(
    FileInterceptor(`image`, {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const destination = `./uploads/${req.user.id}/images`

          await fs.ensureDir(destination)
          callback(null, destination)
        },

        filename: (req, file, callback) => {
          callback(null, `${md5(`${new Date()}${file.originalname}`)}${path.extname(file.originalname)}`)
        },
      }),
    }),
  )
  async saveImage(@UploadedFile() file: Express.Multer.File, @User() user: UserEntity) {
    await this.imageService.saveImageToDB(user.id, file.filename)
  }

  @UseGuards(AuthGuard)
  @Post('/avatar/save')
  @UseInterceptors(
    FileInterceptor(`image`, {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          await fs.ensureDir(`./uploads/${req.user.id}/avatar`)
          callback(null, `./uploads/${req.user.id}/avatar`)
        },

        filename: (req, file, callback) => {
          callback(null, file.originalname)
        },
      }),
    }),
  )
  async saveAvatar(@UploadedFile() file: Express.Multer.File, @User() user: UserEntity) {
    const imageName = 'avatar'
    try {
      await sharp(file.path)
        .resize({
          width: 128,
          height: 128,
        })
        .toFile(`${file.destination}/${imageName}${path.extname(file.originalname)}`)
    } catch (error) {
      //Does not exist a original Image
    }

    await fs.remove(file.path)
    await this.imageService.saveImageToDB(user.id, imageName)
  }
}
