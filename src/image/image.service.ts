import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class ImageService {
  constructor(private readonly dataSource: DataSource) {}
}
