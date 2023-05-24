import { Injectable } from '@nestjs/common'
import { ImageEntity } from 'src/models/image.model'
import { DataSource } from 'typeorm'

@Injectable()
export class ImageService {
  constructor(private readonly dataSource: DataSource) {}

  async saveImageToDB(userId: string, title: string) {
    if (!userId || !title) {
      // request error
    }

    await this.dataSource.getRepository(ImageEntity).insert({ title, userId: Number(userId), date: new Date() })
  }

  async getAllUserImages(userId: string) {
    return this.dataSource.getRepository(ImageEntity).find({ where: { userId: Number(userId) } })
  }
}
