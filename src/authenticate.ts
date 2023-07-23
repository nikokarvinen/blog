import { Post, PrismaClient, User } from '@prisma/client'
import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

// Initialize prisma client
const prisma = new PrismaClient()

// Extend the Express Request interface to include our custom properties
declare module 'express-serve-static-core' {
  interface Request {
    userRepository?: PrismaClient['user']
    postRepository?: PrismaClient['post']
    user?: User
  }
}

// Middleware to attach repositories to the request object
export const attachRepositories = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.userRepository = prisma.user
  req.postRepository = prisma.post
  next()
}

export function refreshUserToken(user: User) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  }) // JWT expires in 1 hour
}

// Middleware to authenticate the JWT token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token

  if (token == null) return res.sendStatus(401)

  // Verify the JWT
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('Missing environment variable JWT_SECRET')
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err: any, user: any) => {
      if (err) {
        console.error('Invalid token:', err)
        return res.sendStatus(403)
      }

      if (!user) {
        return res.status(500).json({
          error: 'User in JWT is not defined',
        })
      }

      try {
        // Fetch the full user data using the user id from JWT
        const fullUser = await prisma.user.findUnique({
          where: { id: user.id },
        })

        if (!fullUser) return res.sendStatus(403)

        req.user = fullUser
        next()
      } catch (error) {
        console.error('Error fetching user:', error)
        res.sendStatus(500)
      }
    })
  } catch (err) {
    console.error('Failed to verify token:', err)
    res.sendStatus(500)
  }
}
