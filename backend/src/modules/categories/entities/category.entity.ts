import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from '@modules/users/entities/user.entity';
import { Expense } from '@modules/expenses/entities/expense.entity';

@Entity('categories')
@Index(['userId', 'name'])
export class Category extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentage: number;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'varchar', length: 7, nullable: true })
  color: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relations
  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];
}
