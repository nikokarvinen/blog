import jwt from 'jsonwebtoken'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Comment } from './Comment'
import { Post } from './Post'

@Entity('app_user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  firstName?: string

  @Column({ nullable: true })
  lastName?: string

  @Column({ nullable: true })
  age?: number

  @Column({ unique: true, length: 100 })
  email!: string

  @Column()
  password!: string

  // Posts field to represent the relationship to the Post entity
  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[]

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[]

  public toAuthJSON = (): { [key: string]: any } => {
    return {
      id: this.id,
      email: this.email,
      token: this.generateJWT(),
      firstName: this.firstName,
      lastName: this.lastName,
    }
  }

  public generateJWT = (): string => {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60) // Set expiry to 60 days from now

    return jwt.sign(
      {
        email: this.email,
        id: this.id,
        exp: parseInt(expirationDate.getTime() / 1000 + '', 10),
      },
      process.env.JWT_SECRET as string
    ) // Make sure to replace 'secret' with your own secret or key stored in environment variables
  }
}
