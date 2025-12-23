import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { UserAccount } from '../entities';

@Injectable()
export class UserAccountRepository extends Repository<UserAccount> {
  constructor(manager: EntityManager) {
    super(UserAccount, manager);
  }
}
