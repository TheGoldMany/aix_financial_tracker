import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDateString, IsUUID, IsEnum, Min } from 'class-validator';
import { ExpenseSource } from '../entities/expense.entity';

export class CreateExpenseDto {
  @ApiProperty({ example: 25000, description: 'Expense amount in HUF' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'uuid', description: 'Category ID' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'Weekly groceries', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-01-15', description: 'Expense date (ISO format)' })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: 'balance',
    enum: ExpenseSource,
    description: 'Source of funds (balance or savings)',
    default: ExpenseSource.BALANCE,
  })
  @IsEnum(ExpenseSource)
  @IsOptional()
  source?: ExpenseSource;
}
