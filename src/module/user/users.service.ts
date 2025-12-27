import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository, UserAccountRepository } from 'src/database';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAccountRepository: UserAccountRepository,
  ) {}

  /**
   * 유저 생성
   * @param createUserDto 유저 생성 정보
   * @returns 생성된 유저
   */
  async create(createUserDto: CreateUserDto) {
    // 이메일 중복 체크
    const existingAccount = await this.userAccountRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingAccount) {
      throw new ConflictException('Email already exists');
    }

    // username 중복 체크
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // User 생성
    const user = this.userRepository.create({
      username: createUserDto.username,
      nickname: createUserDto.nickname,
      profileImage: createUserDto.profileImage,
    });

    const savedUser = await this.userRepository.save(user);

    // 비밀번호 암호화 (로컬 로그인인 경우)
    let hashedPassword: string | null = null;
    if (createUserDto.password) {
      hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    }

    // UserAccount 생성
    const userAccount = this.userAccountRepository.create({
      userId: savedUser.id,
      email: createUserDto.email,
      password: hashedPassword ?? undefined,
      provider: createUserDto.provider,
    });

    await this.userAccountRepository.save(userAccount);

    // 비밀번호 제외하고 반환
    return {
      user: savedUser,
      account: userAccount,
    };
  }

  /**
   * 모든 유저 조회
   */
  async findAll() {
    const users = await this.userRepository.find({
      relations: ['userAccounts'],
    });

    // 비밀번호 제외
    return users.map((user) => ({
      ...user,
      userAccounts: user.userAccounts.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ password, ...account }) => account,
      ),
    }));
  }

  /**
   * 특정 유저 조회
   * @param id 유저 ID
   */
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userAccounts'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // 비밀번호 제외
    return {
      ...user,
      userAccounts: user.userAccounts.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ password, ...account }) => account,
      ),
    };
  }
}
