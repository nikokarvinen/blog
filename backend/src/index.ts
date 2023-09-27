import { PrismaClient } from '@prisma/client'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import commentRoutes from './commentRoute'
import postRoutes from './postRoutes'
import userRoutes from './userRoutes'

if (!process.env.JWT_SECRET || !process.env.PORT) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

process.on('exit', async () => {
  await prisma.$disconnect()
})

const app = express()
const port = process.env.PORT || 3000

app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
)

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(cookieParser())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
  })
})

const main = async () => {
  try {
    await prisma.$connect()
    console.log('Database connection established')

    app.listen(port, () => {
      console.log(`App running on http://localhost:${port}`)
    })
  } catch (err) {
    console.error('Failed to connect to database:', err)
    process.exit(1)
  }
}

main()
