import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class TrackerData {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  time: Date;

  @Column()
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
    bearing: number;
    speed: number;
  };
}