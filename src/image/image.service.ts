import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PaginationParams } from 'src/auth/requests/pagination.params'
import { ImageEntity } from 'src/models/image.model'
import { DataSource } from 'typeorm'

@Injectable()
export class ImageService {
  constructor(private readonly dataSource: DataSource) {}

  async saveImageToDB(userId: number, title: string) {
    if (!userId || !title) {
      throw new InternalServerErrorException()
    }

    await this.dataSource.getRepository(ImageEntity).insert({ title, userId, date: new Date() })
  }

  async getAllUserImages(userId: number) {
    return this.dataSource.getRepository(ImageEntity).find({ where: { userId } })
  }

  async getAllImages(params: PaginationParams) {
    return this.dataSource.getRepository(ImageEntity).find({ skip: (params.page - 1) * params.limit, take: params.limit, relations: { user: true } })
  }
}
