import { ObjectId } from "mongodb";
import { Entity, ObjectIdColumn, Column, BeforeInsert, Unique } from "typeorm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

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

  generateJWT() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT Secret not defined");
    }

    return jwt.sign(
      {
        email: this.email,
        id: this._id,
        exp: parseInt((expirationDate.getTime() / 1000).toString(), 10),
      },
      secret
    );
  }
}
