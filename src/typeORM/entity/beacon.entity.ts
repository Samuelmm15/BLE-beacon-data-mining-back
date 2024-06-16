import { Entity, Column, OneToMany, ObjectIdColumn } from 'typeorm';
import { BeaconMessage } from './beaconMessage.entity';
import { ObjectId } from 'mongodb';
import location from './trackerData.entity';
import { IsInt, Min, Max } from "class-validator";

@Entity()
export class Beacon {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  beaconId!: string;

  @Column()
  time!: Date;

  @Column()
  location!: location;

  @Column()
  @IsInt()
  @Min(1)
  @Max(5)
  rssi!: number;

  // Se define una relación OneToMany con BeaconMessage, es decir, un
  // Beacon puede tener muchos mensajes
  @OneToMany(() => BeaconMessage, beaconMessage => beaconMessage.beacon)
  messages!: BeaconMessage[];
}
