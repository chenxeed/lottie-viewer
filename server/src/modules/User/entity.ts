import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, Relation } from "typeorm"
import { Asset } from "../Asset/entity"

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
  
  @OneToMany(() => Asset, asset => asset.user)
  assets: Relation<Asset>[]
}

