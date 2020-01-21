// @ts-ignore : 'Column' is declared but its value is never read.
import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Data {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  date:Date;

  @Column({type:"decimal"})
  @Index()
  data:number;

  @Column()
  @Index()
  deviceName:string;

}
