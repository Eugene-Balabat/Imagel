import { ImageEntity } from 'src/models/image.model'

export class ImageResponse {
  title: string

  constructor(data: ImageEntity) {
    this.title = data.title
  }
}
