import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'
import { genSalt, hash } from 'bcryptjs'

@Entity({
  name: 'user',
})
@Index('user_email_idx', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  userId: number

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  email: string

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
    select: false,
  })
  password: string

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  firstName: string

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  lastName: string

  @Column({
    type: 'varchar',
    length: 521,
    nullable: true,
    unique: true
  })
  yandexAccountId: string | null

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    this.password = await hash(this.password, await genSalt())
  }
}
