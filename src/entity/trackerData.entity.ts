import { ObjectId } from "mongodb";
import { Entity, ObjectIdColumn, Column, Index } from "typeorm";

interface location {
  latitude: number;
  longitude: number;
  altitude: number;
  bearing: number;
  speed: number;
}

@Entity()
export class TrackerData {
  @ObjectIdColumn()
  id: ObjectId = new ObjectId;

  @Index({unique: true})
  @Column()
  droneId!: string;

  @Column()
  time!: Date;

  @Column()
  location!: location;
}
