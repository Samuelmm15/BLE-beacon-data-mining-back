import { ObjectId } from "mongodb";
import { Entity, ObjectIdColumn, Column, BeforeInsert, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(["email"])
export class User {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}