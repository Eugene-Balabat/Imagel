import { ImageEntity } from 'src/models/image.model'
import { UserResponse } from './user.response'

export class ImageResponse {
  title: string
  date: Date
  user: UserResponse

  constructor(data: ImageEntity) {
    this.title = data.title
    this.date = data.date
    this.user = new UserResponse(data.user)
  }
}
