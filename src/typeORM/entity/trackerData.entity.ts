import { ObjectId } from "mongodb";
import { Entity, ObjectIdColumn, Column } from "typeorm";

export default interface location {
  latitude: number;
  longitude: number;
  altitude: number;
  bearing: string;
  speed: string;
}

@Entity()
export class TrackerData {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  droneId!: string;

  @Column()
  time!: Date;

  @Column()
  location!: location;

}
