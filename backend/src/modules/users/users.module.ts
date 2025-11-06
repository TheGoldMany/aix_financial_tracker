import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { Saving } from '@modules/savings/entities/saving.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Saving])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
