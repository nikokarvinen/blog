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
  passport.serializeUser((user: any, done) => done(null, user.id))
  passport.deserializeUser((id: number, done) => {
    return getUserById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err, null))
  })
}
