import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from '@modules/users/entities/user.entity';

@Entity('savings')
@Index(['userId'], { unique: true })
export class Saving extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number;

  // Relations
  @ManyToOne(() => User, (user) => user.savings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
