import { Entity, Column, ManyToOne, ObjectIdColumn } from 'typeorm';
import { Beacon } from './beacon.entity';
import { ObjectId } from 'mongodb';

@Entity()
export class BeaconMessage {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  message!: string;

  // Define una relación ManyToOne con Beacon, es decir, muchos
  // mensajes pueden pertenecer a un solo Beacon
  @ManyToOne(() => Beacon, beacon => beacon.messages)
  beacon!: Beacon;
}
