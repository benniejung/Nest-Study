import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserAccountRepository, UserRepository } from 'src/database';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserAccountRepository],
  exports: [],
})
export class UsersModule {}
