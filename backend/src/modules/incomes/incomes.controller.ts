import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { QueryIncomeDto } from './dto/query-income.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('incomes')
@Controller('incomes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new income' })
  @ApiResponse({ status: 201, description: 'Income created successfully' })
  create(@CurrentUser('id') userId: string, @Body() createIncomeDto: CreateIncomeDto) {
    return this.incomesService.create(userId, createIncomeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all incomes with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Returns paginated incomes' })
  findAll(@CurrentUser('id') userId: string, @Query() query: QueryIncomeDto) {
    return this.incomesService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific income by ID' })
  @ApiResponse({ status: 200, description: 'Returns the income' })
  @ApiResponse({ status: 404, description: 'Income not found' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.incomesService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an income' })
  @ApiResponse({ status: 200, description: 'Income updated successfully' })
  @ApiResponse({ status: 404, description: 'Income not found' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ) {
    return this.incomesService.update(userId, id, updateIncomeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an income' })
  @ApiResponse({ status: 204, description: 'Income deleted successfully' })
  @ApiResponse({ status: 404, description: 'Income not found' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.incomesService.remove(userId, id);
  }
}
