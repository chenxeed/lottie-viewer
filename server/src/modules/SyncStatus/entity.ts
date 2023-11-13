import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, Relation, CreateDateColumn, ManyToOne } from "typeorm"
import { User } from "../User/entity"

@Entity()
export class SyncStatus extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  lastUpdate: Date

  @ManyToOne(() => User, user => user.assets)
  user: Relation<User>  
}

