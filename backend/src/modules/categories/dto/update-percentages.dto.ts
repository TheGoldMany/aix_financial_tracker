import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { IsUUID, IsNumber, Min, Max } from 'class-validator';

class CategoryPercentage {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 25, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}

export class UpdatePercentagesDto {
  @ApiProperty({
    description: 'Array of category IDs with their new percentages (must sum to 100)',
    type: [CategoryPercentage],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CategoryPercentage)
  categories: CategoryPercentage[];
}
