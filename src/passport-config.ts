import bcrypt from 'bcrypt'
import { PassportStatic } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { User } from './entity/User'

export function initialize(
  passport: PassportStatic,
  getUserByEmail: (email: string) => Promise<User | undefined>,
  getUserById: (id: number) => Promise<User | undefined>
) {
  const authenticateUser = async (
    email: string,
    password: string,
    done: (error: any, user?: any) => void
  ) => {
    const user = await getUserByEmail(email)
    if (user == null) {
      return done(new Error('No user with that email'))
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(new Error('Incorrect password'))
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user: any, done) => {
    console.log('Serializing user with id:', user.id) // add log here
    done(null, user.id)
  })
  passport.deserializeUser((id: number, done) => {
    console.log('Deserializing user with id:', id) // and here

    if (id !== undefined && id !== null) {
      return getUserById(id)
        .then((user) => {
          console.log('Found user:', user)
          done(null, user)
        })
        .catch((err) => {
          console.error('Error fetching user:', err)
          done(err, null)
        })
    } else {
      console.error('Invalid user ID')
      done(new Error('Invalid user ID'), null)
    }
  })
}
