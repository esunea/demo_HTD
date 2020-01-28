// @ts-ignore : 'Column' is declared but its value is never read.
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Config {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key:string;

  @Column()
  value:string;
}
