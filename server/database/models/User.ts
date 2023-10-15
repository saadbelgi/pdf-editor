import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { SavedFile } from './SavedFile';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column({
    type: 'binary',
    length: 60,
  })
  password!: Buffer;

  @OneToMany(() => SavedFile, (savedFile) => savedFile.owner, {
    cascade: ['remove', 'insert', 'update'],
  })
  savedFiles!: SavedFile[];
}
