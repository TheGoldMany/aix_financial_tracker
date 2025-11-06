import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({ example: 20000, description: 'Amount to withdraw from savings' })
  @IsNumber()
  @Min(0.01)
  amount: number;
}
