import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from './entities/saving.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Saving])],
  controllers: [],
  providers: [],
  exports: [],
})
export class SavingsModule {}
