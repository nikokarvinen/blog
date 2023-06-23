import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Repository } from 'typeorm'
import { Comment } from './entity/Comment'
import { Post } from './entity/Post'
import { User } from './entity/User'

declare module 'express-serve-static-core' {
  interface Request {
    userRepository?: Repository<User>
    postRepository?: Repository<Post>
    commentRepository?: Repository<Comment>
    user?: User
  }
}

// Middleware to attach repositories to request object
export const attachRepositories = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.userRepository = req.app.locals.userRepository
  req.postRepository = req.app.locals.postRepository
  next()
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'secret',
    (err: any, user: any) => {
      if (err) return res.sendStatus(403)

      if (!req.userRepository || !user) {
        return res.status(500).json({
          error: 'userRepository not initialized or user in JWT is not defined',
        })
      }

      req.userRepository.findOne(user.id).then((fullUser) => {
        if (!fullUser) return res.sendStatus(403)

        req.user = fullUser
        next()
      })
    }
  )
}
