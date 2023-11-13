import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, Relation, JoinColumn, CreateDateColumn } from "typeorm"
import { User } from "../User/entity"

@Entity()
export class Asset extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  // NOTE: This is a text field because we're storing the file as a base64 string.
  // This is not the best solution due to the potentially huge size of the file.
  // TODO: Upload to S3 instead and store the file key here
  @Column({
    type: 'text'
  })
  file: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, user => user.assets)
  user: Relation<User>
}
