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
  @UseInterceptors(FileInterceptor(`image`))
  async saveImage(@UploadedFile() file: Express.Multer.File, @User() user: UserEntity) {
    const destination = `./uploads/${user.id}/images`
    const fileName = `${md5(`${new Date()}${file.originalname}`)}${path.extname(file.originalname)}`

    await fs.ensureDir(destination)
    await fs.writeFile(`${destination}/${fileName}`, file.buffer)

    await this.imageService.saveImageToDB(user.id, fileName)
  }

  @UseGuards(AuthGuard)
  @Post('/avatar/save')
  @UseInterceptors(FileInterceptor(`image`))
  async saveAvatar(@UploadedFile() file: Express.Multer.File, @User() user: UserEntity) {
    const fileName = 'avatar'
    const destination = `./uploads/${user.id}/avatar`

    await fs.ensureDir(destination)

    try {
      await sharp(file.buffer)
        .resize({
          width: 128,
          height: 128,
        })
        .toFile(`${destination}/${fileName}${path.extname(file.originalname)}`)
    } catch (error) {
      //Error with getting File
    }

    await this.imageService.saveImageToDB(user.id, fileName)
  }
}
