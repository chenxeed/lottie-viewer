import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, Relation, JoinColumn, CreateDateColumn } from "typeorm"
import { User } from "../User/entity"

@Entity()
export class Asset extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: false
  })
  title: string

  @Column()
  criteria: string

  @Column()
  file: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, user => user.assets)
  user: Relation<User>
}
