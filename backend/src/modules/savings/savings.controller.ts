import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SavingsService } from './savings.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('savings')
@Controller('savings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get savings account information' })
  @ApiResponse({ status: 200, description: 'Returns savings account' })
  getSavings(@CurrentUser('id') userId: string) {
    return this.savingsService.getSavings(userId);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money to savings' })
  @ApiResponse({ status: 200, description: 'Deposit successful' })
  @ApiResponse({ status: 400, description: 'Invalid amount' })
  deposit(@CurrentUser('id') userId: string, @Body() depositDto: DepositDto) {
    return this.savingsService.deposit(userId, depositDto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from savings' })
  @ApiResponse({ status: 200, description: 'Withdrawal successful' })
  @ApiResponse({ status: 400, description: 'Insufficient balance' })
  withdraw(@CurrentUser('id') userId: string, @Body() withdrawDto: WithdrawDto) {
    return this.savingsService.withdraw(userId, withdrawDto);
  }
}
