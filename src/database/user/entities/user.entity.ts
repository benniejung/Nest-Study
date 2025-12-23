import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 50 })
  nickname: string;

  @Column({ nullable: true, length: 255 })
  profileImage: string;

  @Column({ default: 'active', length: 20 })
  status: string; // active, inactive, banned 등

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserAccount, (userAccount) => userAccount.user, {
    cascade: true,
  })
  userAccounts: UserAccount[];
}
