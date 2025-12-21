import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserAccount } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(
      String(createUserDto.username),
      String(createUserDto.nickname),
      createUserDto.profileImage ? String(createUserDto.profileImage) : null,
      String(createUserDto.email),
      createUserDto.password ? String(createUserDto.password) : null,
      createUserDto.provider || 0,
    );
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  // UserAccount 관련 엔드포인트
  @Get(':id/account')
  async getUserAccount(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserAccount> {
    return this.usersService.getUserAccount(id);
  }

  @Put(':id/account')
  async updateUserAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserAccountDto: UpdateUserAccountDto,
  ): Promise<UserAccount> {
    return this.usersService.updateUserAccount(id, updateUserAccountDto);
  }
}
