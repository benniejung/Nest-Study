import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User, UserAccount } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createUser(
    username: string,
    nickname: string,
    profileImage: string | null,
    email: string,
    password: string | null,
    provider: number = 0,
  ): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // User 생성
      const userResult = (await queryRunner.query(
        `INSERT INTO user (username, nickname, profileImage, createdAt, updatedAt) 
         VALUES (?, ?, ?, NOW(), NOW())`,
        [username, nickname, profileImage],
      )) as { insertId: number };

      const userIdInserted = userResult.insertId;

      // UserAccount 자동 생성
      await queryRunner.query(
        `INSERT INTO user_account (userId, email, password, provider, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [userIdInserted, email, password, provider],
      );

      await queryRunner.commitTransaction();

      return this.findOne(userIdInserted);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<User[]> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const users = (await this.dataSource.query(
      `SELECT * FROM user ORDER BY createdAt DESC`,
    )) as User[];

    // 각 사용자의 계정 정보도 함께 조회
    for (const user of users) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const accounts = (await this.dataSource.query(
        `SELECT * FROM user_account WHERE userId = ?`,
        [user.id],
      )) as UserAccount[];
      user.userAccount = accounts[0] || null;
    }

    return users;
  }

  async findOne(id: number): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const users = (await this.dataSource.query(
      `SELECT * FROM user WHERE id = ?`,
      [id],
    )) as User[];

    const user = users[0];
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // UserAccount 정보도 함께 조회
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const accounts = (await this.dataSource.query(
      `SELECT * FROM user_account WHERE userId = ?`,
      [id],
    )) as UserAccount[];
    user.userAccount = accounts[0] || null;

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const users = (await this.dataSource.query(
      `SELECT * FROM user WHERE username = ?`,
      [username],
    )) as User[];

    const user = users[0];
    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const accounts = (await this.dataSource.query(
      `SELECT * FROM user_account WHERE userId = ?`,
      [user.id],
    )) as UserAccount[];
    user.userAccount = accounts[0] || null;

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    // UserAccount에서 email로 조회
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const accounts = (await this.dataSource.query(
      `SELECT * FROM user_account WHERE email = ?`,
      [email],
    )) as UserAccount[];

    const account = accounts[0];
    if (!account) {
      return null;
    }

    // User 정보 조회
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const users = (await this.dataSource.query(
      `SELECT * FROM user WHERE id = ?`,
      [account.userId],
    )) as User[];

    const user = users[0];
    if (!user) {
      return null;
    }

    user.userAccount = account;
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (updateData.username !== undefined) {
      fields.push('username = ?');
      values.push(updateData.username);
    }
    if (updateData.nickname !== undefined) {
      fields.push('nickname = ?');
      values.push(updateData.nickname);
    }
    if (updateData.profileImage !== undefined) {
      fields.push('profileImage = ?');
      values.push(updateData.profileImage);
    }

    if (fields.length === 0) {
      return this.findOne(id);
    }

    fields.push('updatedAt = NOW()');
    values.push(id);

    await this.dataSource.query(
      `UPDATE user SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );

    return this.findOne(id);
  }

  async deleteUser(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // UserAccount 먼저 삭제
      await queryRunner.query(`DELETE FROM user_account WHERE userId = ?`, [
        id,
      ]);

      // User 삭제
      await queryRunner.query(`DELETE FROM user WHERE id = ?`, [id]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // UserAccount 관련 메서드
  async getUserAccount(userId: number): Promise<UserAccount> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const accounts = (await this.dataSource.query(
      `SELECT * FROM user_account WHERE userId = ?`,
      [userId],
    )) as UserAccount[];

    const userAccount = accounts[0];
    if (!userAccount) {
      throw new NotFoundException(
        `UserAccount for User ID ${userId} not found`,
      );
    }

    // User 정보도 함께 조회
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const users = (await this.dataSource.query(
      `SELECT * FROM user WHERE id = ?`,
      [userId],
    )) as User[];
    userAccount.user = users[0] || null;

    return userAccount;
  }

  async updateUserAccount(
    userId: number,
    updateData: Partial<UserAccount>,
  ): Promise<UserAccount> {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (updateData.email !== undefined) {
      fields.push('email = ?');
      values.push(updateData.email);
    }
    if (updateData.password !== undefined) {
      fields.push('password = ?');
      values.push(updateData.password);
    }
    if (updateData.provider !== undefined) {
      fields.push('provider = ?');
      values.push(updateData.provider);
    }

    if (fields.length === 0) {
      return this.getUserAccount(userId);
    }

    fields.push('updatedAt = NOW()');
    values.push(userId);

    await this.dataSource.query(
      `UPDATE user_account SET ${fields.join(', ')} WHERE userId = ?`,
      values,
    );

    return this.getUserAccount(userId);
  }
}
