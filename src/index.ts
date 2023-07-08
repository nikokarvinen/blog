import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import helmet from 'helmet'
import passport from 'passport'
import { DataSource, DataSourceOptions } from 'typeorm'
import commentRoutes from './commentRoute'
import { Comment } from './entity/Comment'
import { Post } from './entity/Post'
import { User } from './entity/User'
import { initialize } from './passport-config'
import postRoutes from './postRoutes'
import userRoutes from './userRoutes'

if (!process.env.JWT_SECRET) {
  console.error('Missing environment variable JWT_SECRET')
  process.exit(1)
}

// database configuration
const dbOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [__dirname + '/entity/*.ts'],
}

export const appDataSource = new DataSource(dbOptions)

const app = express()
const port = process.env.PORT || 3000

app.locals.userRepository = appDataSource.getRepository(User)
app.locals.postRepository = appDataSource.getRepository(Post)
app.locals.commentRepository = appDataSource.getRepository(Comment)

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

// app.use(helmet())
app.use(cookieParser())
app.use(express.json())

// Initialize session
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
)

app.use((req, res, next) => {
  if (!req.app.locals.userRepository || !req.app.locals.postRepository) {
    return res.status(500).json({
      error: 'Required repositories not initialized',
    })
  }

  req.userRepository = req.app.locals.userRepository
  req.postRepository = req.app.locals.postRepository
  req.commentRepository = req.app.locals.commentRepository
  next()
})

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send({
    status: 'error',
    message: err.message,
  })
})

const main = async () => {
  try {
    await appDataSource.initialize()
    console.log('Database connection established')

    // Initialize Passport configuration
    initialize(
      passport,
      async (email) => {
        console.log(`Finding user with email: ${email}`)
        const users = await app.locals.userRepository.find()
        return users.find((user: User) => user.email === email)
      },
      async (id) => {
        console.log(`Finding user with id: ${id}`)
        const users = await app.locals.userRepository.find()
        return users.find((user: User) => user.id === id)
      }
    )

    app.listen(port, () => {
      console.log(`App running on http://localhost:${port}`)
    })
  } catch (err) {
    console.error('Failed to connect to database:', err)
    process.exit(1)
  }
}

main()
