import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdatePercentagesDto } from './dto/update-percentages.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new custom category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., percentage exceeds 100)' })
  @ApiResponse({ status: 409, description: 'Category name already exists' })
  create(@CurrentUser('id') userId: string, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories for the user' })
  @ApiResponse({ status: 200, description: 'Returns all categories' })
  findAll(@CurrentUser('id') userId: string) {
    return this.categoriesService.findAll(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get category statistics with spending data' })
  @ApiResponse({ status: 200, description: 'Returns category statistics' })
  getStats(@CurrentUser('id') userId: string) {
    return this.categoriesService.getCategoryStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific category by ID' })
  @ApiResponse({ status: 200, description: 'Returns the category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.categoriesService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., percentage exceeds 100)' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(userId, id, updateCategoryDto);
  }

  @Put('percentages')
  @ApiOperation({ summary: 'Update percentages for multiple categories (must sum to 100)' })
  @ApiResponse({ status: 200, description: 'Percentages updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., percentages dont sum to 100)' })
  updatePercentages(
    @CurrentUser('id') userId: string,
    @Body() updatePercentagesDto: UpdatePercentagesDto,
  ) {
    return this.categoriesService.updatePercentages(userId, updatePercentagesDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a custom category' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete default categories' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.categoriesService.remove(userId, id);
  }
}
