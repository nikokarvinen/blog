import { default as bodyParser } from 'body-parser'
import 'dotenv/config'
import express from 'express'
import { DataSource, DataSourceOptions } from 'typeorm'
import { User } from './entity/User'
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

app.use(express.json())
app.use(bodyParser.json())
app.use('/', router)

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/users', async (req, res) => {
  const { firstName, lastName, age } = req.body
  const userRepo = appDataSource.getRepository(User)
  const user = new User()
  user.firstName = firstName
  user.lastName = lastName
  user.age = age
  await userRepo.save(user)
  res.json(user)
})

app.get('/users', async (req, res) => {
  const userRepo = appDataSource.getRepository(User)
  const users = await userRepo.find()
  res.json(users)
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
