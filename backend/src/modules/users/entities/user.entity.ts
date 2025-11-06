import { Entity, Column, OneToMany, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@common/entities/base.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { Income } from '@modules/incomes/entities/income.entity';
import { Expense } from '@modules/expenses/entities/expense.entity';
import { Saving } from '@modules/savings/entities/saving.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  @Exclude()
  passwordHash: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ name: 'is_pro', type: 'boolean', default: false })
  isPro: boolean;

  @Column({ name: 'subscription_expires_at', type: 'timestamp', nullable: true })
  subscriptionExpiresAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ name: 'verification_token', type: 'varchar', nullable: true })
  @Exclude()
  verificationToken: string;

  @Column({ name: 'reset_password_token', type: 'varchar', nullable: true })
  @Exclude()
  resetPasswordToken: string;

  @Column({ name: 'reset_password_expires', type: 'timestamp', nullable: true })
  @Exclude()
  resetPasswordExpires: Date;

  // Relations
  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Income, (income) => income.user)
  incomes: Income[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

  @OneToMany(() => Saving, (saving) => saving.user)
  savings: Saving[];
}
