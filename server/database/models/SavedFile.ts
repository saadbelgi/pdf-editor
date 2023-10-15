import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class SavedFile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  originalName!: string;

  @Column()
  fileName!: string;

  @Column()
  size!: number;

  @Column()
  destinationFolder!: string;

  @CreateDateColumn()
  creationTime!: Date;

  @ManyToOne(() => User, (owner) => owner.savedFiles, {
    cascade: ['update', 'insert'],
  })
  owner!: User;
}
