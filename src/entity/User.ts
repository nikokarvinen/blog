import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Post } from './Post'

@Entity('app_user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column()
  age!: number

  // Here we add the posts field to represent the relationship to the Post entity
  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[]
}
