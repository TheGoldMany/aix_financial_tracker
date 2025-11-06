import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from '@modules/users/entities/user.entity';

@Entity('incomes')
@Index(['userId', 'date'])
export class Income extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({
    name: 'savings_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  savingsPercentage: number;

  // Relations
  @ManyToOne(() => User, (user) => user.incomes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
