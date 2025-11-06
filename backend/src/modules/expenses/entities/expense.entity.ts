import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from '@modules/users/entities/user.entity';
import { Category } from '@modules/categories/entities/category.entity';

export enum ExpenseSource {
  BALANCE = 'balance',
  SAVINGS = 'savings',
}

@Entity('expenses')
@Index(['userId', 'date'])
@Index(['categoryId'])
export class Expense extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: ExpenseSource,
    default: ExpenseSource.BALANCE,
  })
  source: ExpenseSource;

  // Relations
  @ManyToOne(() => User, (user) => user.expenses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.expenses, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
