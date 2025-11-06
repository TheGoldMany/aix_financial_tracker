import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max, MaxLength, Matches } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Utazás', description: 'Category name' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 5, description: 'Budget percentage (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiProperty({ example: '#FF6384', description: 'Color in hex format', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'Color must be a valid hex color (e.g., #FF6384)' })
  color?: string;

  @ApiProperty({ example: 'Travel and vacation expenses', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
