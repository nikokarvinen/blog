import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Comment } from './Comment'
import { User } from './User'

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column()
  content!: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date

  @Column('simple-array')
  tags!: string[]

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[]
}
