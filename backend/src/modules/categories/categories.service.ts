import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdatePercentagesDto } from './dto/update-percentages.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category name already exists for this user
    const existingCategory = await this.categoriesRepository.findOne({
      where: { userId, name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    // Verify total percentages don't exceed 100
    const currentTotal = await this.getTotalPercentage(userId);
    if (currentTotal + createCategoryDto.percentage > 100) {
      throw new BadRequestException(
        `Total percentage would exceed 100%. Current total: ${currentTotal}%, trying to add: ${createCategoryDto.percentage}%`,
      );
    }

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      userId,
      isDefault: false,
    });

    return this.categoriesRepository.save(category);
  }

  async findAll(userId: string): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(userId: string, id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(userId, id);

    // If name is being changed, check for duplicates
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { userId, name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    // If percentage is being changed, verify total doesn't exceed 100
    if (updateCategoryDto.percentage !== undefined && updateCategoryDto.percentage !== parseFloat(category.percentage.toString())) {
      const currentTotal = await this.getTotalPercentage(userId, id);
      if (currentTotal + updateCategoryDto.percentage > 100) {
        throw new BadRequestException(
          `Total percentage would exceed 100%. Current total (excluding this category): ${currentTotal}%, new value: ${updateCategoryDto.percentage}%`,
        );
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(userId: string, id: string): Promise<void> {
    const category = await this.findOne(userId, id);

    if (category.isDefault) {
      throw new BadRequestException('Cannot delete default categories');
    }

    // Check if category has expenses
    // Note: Due to RESTRICT foreign key, this will throw an error if there are expenses
    await this.categoriesRepository.remove(category);
  }

  async updatePercentages(userId: string, updatePercentagesDto: UpdatePercentagesDto): Promise<Category[]> {
    // Validate all categories belong to user
    const categoryIds = updatePercentagesDto.categories.map((c) => c.id);
    const categories = await this.categoriesRepository.find({
      where: categoryIds.map((id) => ({ id, userId })),
    });

    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('One or more categories not found');
    }

    // Calculate total percentage
    const totalPercentage = updatePercentagesDto.categories.reduce((sum, cat) => sum + cat.percentage, 0);

    // Allow some tolerance for floating point errors
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new BadRequestException(
        `Total percentage must equal 100%. Current total: ${totalPercentage}%`,
      );
    }

    // Update all categories
    const updates = updatePercentagesDto.categories.map(async (catUpdate) => {
      const category = categories.find((c) => c.id === catUpdate.id);
      if (category) {
        category.percentage = catUpdate.percentage;
        return this.categoriesRepository.save(category);
      }
    });

    return Promise.all(updates);
  }

  async getCategoryStats(userId: string): Promise<any[]> {
    // This would include spending vs budget for each category
    // For now, return basic category info
    return this.findAll(userId);
  }

  private async getTotalPercentage(userId: string, excludeId?: string): Promise<number> {
    const queryBuilder = this.categoriesRepository
      .createQueryBuilder('category')
      .select('SUM(category.percentage)', 'total')
      .where('category.userId = :userId', { userId });

    if (excludeId) {
      queryBuilder.andWhere('category.id != :excludeId', { excludeId });
    }

    const result = await queryBuilder.getRawOne();
    return parseFloat(result.total) || 0;
  }
}
