import { Repository } from 'typeorm'
import { Post } from './entity/Post'
import { User } from './entity/User'

declare module 'express-serve-static-core' {
  interface Request {
    userRepository?: Repository<User>
    postRepository?: Repository<Post>
  }
}
