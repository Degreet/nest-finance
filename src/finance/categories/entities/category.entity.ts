import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionType } from '../../transactions/enums/transaction-type.enum';
import { User } from '../../../users/entities/user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
