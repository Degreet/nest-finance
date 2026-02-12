import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { TransactionType } from '../enums/transaction-type.enum';
import { User } from '../../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: 'CASCADE',
  })
  account: Account;

  @Column()
  accountId: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: string;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
