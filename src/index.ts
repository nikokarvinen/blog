import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import passport from 'passport'
import { DataSource, DataSourceOptions } from 'typeorm'
import { Post } from './entity/Post'
import { User } from './entity/User'
import { initialize } from './passport-config'
import router from './routes'

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

appDataSource
  .initialize()
  .then(() => {
    console.log('Database connection established')
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err)
    process.exit(1)
  })

const app = express()
const port = 3000

app.locals.userRepository = appDataSource.getRepository(User)
app.locals.postRepository = appDataSource.getRepository(Post)

// Initialize session
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
)

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

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

app.use(express.json())
app.use('/', router)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send({
    status: 'error',
    message: err.message,
  })
})

const main = async () => {
  await appDataSource.initialize()
  app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
