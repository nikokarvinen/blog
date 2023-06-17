import express, { Request, Response } from 'express'
import { User } from './entity/User'
import { appDataSource } from './index'

const router = express.Router()

// READ all users
router.get('/users', async (req, res) => {
  const userRepository = appDataSource.getRepository(User)
  const users = await userRepository.find()
  res.json(users)
})

// CREATE a new user
router.post('/users', async (req, res) => {
  const userRepository = appDataSource.getRepository(User)
  const newUser = userRepository.create(req.body) // create a new user with the submitted data
  const results = await userRepository.save(newUser) // saves the new user
  res.send(results)
})

// READ a single user by ID
router.get('/users/:id', async (req, res) => {
  const userRepository = appDataSource.getRepository(User)
  const user = await userRepository.findOne({
    where: { id: Number(req.params.id) },
  })
  if (user) {
    res.send(user)
  } else {
    res.status(404).send('User not found')
  }
})

// UPDATE a user
router.put('/users/:id', async function (req: Request, res: Response) {
  const userRepository = appDataSource.getRepository(User)
  const user = await userRepository.findOne({
    where: { id: Number(req.params.id) },
  })

  if (!user) {
    res.status(404).send('User not found')
    return
  }

  userRepository.merge(user, req.body)
  const results = await userRepository.save(user)
  res.send(results)
})

// DELETE a user
router.delete('/users/:id', async (req, res) => {
  const userRepository = appDataSource.getRepository(User)
  const result = await userRepository.delete(Number(req.params.id))
  res.send(result)
})

export default router
