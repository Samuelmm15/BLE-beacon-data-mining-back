import { Entity, Column, OneToMany, ObjectIdColumn } from 'typeorm';
import { BeaconMessage } from './beaconMessage.entity';
import { ObjectId } from 'mongodb';

@Entity()
export class Beacon {
  @ObjectIdColumn()
  id: ObjectId = new ObjectId;

  @Column({ unique: true })
  beaconId!: string;

  // Se define una relación OneToMany con BeaconMessage, es decir, un
  // Beacon puede tener muchos mensajes
  @OneToMany(() => BeaconMessage, beaconMessage => beaconMessage.beacon)
  messages!: BeaconMessage[];
}
