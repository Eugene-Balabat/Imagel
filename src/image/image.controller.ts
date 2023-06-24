import { BadRequestException, Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
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
import { ConfigService } from '@nestjs/config'
import { DataSource } from 'typeorm'

@Controller('/image')
export class ImageController {
  constructor(private readonly imageService: ImageService, private readonly configService: ConfigService, private readonly dataSource: DataSource) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserImages(@User() user: UserEntity) {
    return await this.dataSource.transaction(async (trx) => {
      return this.imageService.getAllUserImages(user.id, trx)
    })
  }

  @UseGuards(AuthGuard)
  @Get('/all')
  async getAllImages(@Query() params: PaginationParams) {
    return await this.dataSource.transaction(async (trx) => {
      const imageData = await this.imageService.getAllImages(params, trx)
      return imageData.map((image) => new ImageResponse(image))
    })
  }

  // Можно добавить валидацию на входящие файлы
  @UseGuards(AuthGuard)
  @Post('/image/save')
  @UseInterceptors(FileInterceptor(`image`))
  async saveImage(@UploadedFile() file: Express.Multer.File, @User() user: UserEntity) {
    await this.dataSource.transaction(async (trx) => {
      const destination = `./uploads/${user.id}/images`
      const fileName = `${md5(`${new Date()}${file.originalname}`)}${path.extname(file.originalname)}`

      await fs.ensureDir(destination)
      await fs.writeFile(`${destination}/${fileName}`, file.buffer)

      await this.imageService.saveImageToDB(user.id, fileName, trx)
    })
  }

  @UseGuards(AuthGuard)
  @Post('/avatar/save')
  @UseInterceptors(FileInterceptor(`image`))
  async saveAvatar(@UploadedFile() file: Express.Multer.File, @User() user: UserEntity) {
    await this.dataSource.transaction(async (trx) => {
      const fileName = this.configService.get('ACCOUNT_MAIN_PHOTO_NAME')
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
        throw new BadRequestException()
      }

      await this.imageService.saveImageToDB(user.id, fileName, trx)
    })
  }
}
