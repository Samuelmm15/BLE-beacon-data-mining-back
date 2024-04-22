import { Entity, Column, OneToMany, ObjectIdColumn } from 'typeorm';
import { BeaconMessage } from './beaconMessage.entity';
import { ObjectId } from 'mongodb';
import location from './trackerData.entity';

@Entity()
export class Beacon {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ unique: true })
  beaconId!: string;

  @Column()
  time!: Date;

  @Column()
  location!: location;

  // Se define una relación OneToMany con BeaconMessage, es decir, un
  // Beacon puede tener muchos mensajes
  @OneToMany(() => BeaconMessage, beaconMessage => beaconMessage.beacon)
  messages!: BeaconMessage[];
}
