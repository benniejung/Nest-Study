import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum Provider {
  Normal = 0,
  KAKAO = 1,
}

@Entity('user_account')
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ nullable: true, length: 255 })
  password: string; // 소셜 로그인은 null

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.Normal,
  })
  provider: Provider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userAccounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
