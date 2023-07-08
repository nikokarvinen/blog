// Comment.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  content!: string;

  @ManyToOne((type) => User, (user) => user.comments)
  user!: User;

  @ManyToOne((type) => Post, (post) => post.comments)
  post!: Post;
}
