import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({ example: 350000, description: 'Income amount in HUF' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'Monthly salary', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-01-15', description: 'Income date (ISO format)' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Salary', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 20,
    description: 'Percentage to allocate to savings (0-100)',
    minimum: 0,
    maximum: 100,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  savingsPercentage?: number;
}
