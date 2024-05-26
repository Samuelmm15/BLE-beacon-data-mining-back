import { ObjectId } from "mongodb";
import { Entity, ObjectIdColumn, Column } from "typeorm";
import { IsInt, Min, Max } from "class-validator";

export default interface location {
  latitude: number;
  longitude: number;
  altitude: number;
  bearing: number;
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

  @Column()
  @IsInt()
  @Min(1)
  @Max(5)
  rssi!: number;
}
