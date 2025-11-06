import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { Saving } from '@modules/savings/entities/saving.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Saving)
    private savingsRepository: Repository<Saving>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.usersRepository.update(userId, { passwordHash });
  }

  async setResetPasswordToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.usersRepository.update(userId, {
      resetPasswordToken: token,
      resetPasswordExpires: expiresAt,
    });
  }

  async clearResetPasswordToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  async initializeDefaultCategories(userId: string): Promise<void> {
    const defaultCategories = [
      { name: 'Élelmiszer', percentage: 25, color: '#FF6384' },
      { name: 'Háztartás', percentage: 15, color: '#36A2EB' },
      { name: 'Közlekedés', percentage: 15, color: '#FFCE56' },
      { name: 'Szórakozás', percentage: 10, color: '#4BC0C0' },
      { name: 'Egészségügy', percentage: 10, color: '#9966FF' },
      { name: 'Oktatás', percentage: 10, color: '#FF9F40' },
      { name: 'Ruházat', percentage: 10, color: '#FF6384' },
      { name: 'Egyéb', percentage: 5, color: '#C9CBCF' },
    ];

    const categories = defaultCategories.map((cat) =>
      this.categoriesRepository.create({
        userId,
        name: cat.name,
        percentage: cat.percentage,
        color: cat.color,
        isDefault: true,
      }),
    );

    await this.categoriesRepository.save(categories);
  }

  async initializeSavingsAccount(userId: string): Promise<void> {
    const savings = this.savingsRepository.create({
      userId,
      balance: 0,
    });

    await this.savingsRepository.save(savings);
  }
}
