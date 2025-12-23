import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UserAccountRepository, UserRepository } from 'src/database';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserAccountRepository],
  exports: [],
})
export class UsersModule {}
