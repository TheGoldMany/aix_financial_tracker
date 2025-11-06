import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 50000, description: 'Amount to deposit to savings' })
  @IsNumber()
  @Min(0.01)
  amount: number;
}
