import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PaginationParams } from 'src/auth/requests/pagination.params'
import { ImageEntity } from 'src/models/image.model'
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class ImageService {
  constructor(private readonly dataSource: DataSource) {}

  async saveImageToDB(userId: number, title: string, trx?: EntityManager) {
    await (trx || this.dataSource).getRepository(ImageEntity).insert({ title, userId, date: new Date() })
  }

  async getAllUserImages(userId: number, trx?: EntityManager) {
    return await (trx || this.dataSource).getRepository(ImageEntity).find({ where: { userId } })
  }

  async getAllImages(params: PaginationParams, trx?: EntityManager) {
    return (trx || this.dataSource).getRepository(ImageEntity).find({ skip: (params.page - 1) * params.limit, take: params.limit, relations: { user: true } })
  }
}
