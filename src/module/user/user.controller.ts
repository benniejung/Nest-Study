import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성' })
  @ApiResponse({ status: 201, description: '유저 생성 성공' })
  @ApiResponse({ status: 409, description: '이메일 또는 username 중복' })
  create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 유저 조회' })
  @ApiResponse({ status: 200, description: '유저 목록 조회 성공' })
  findAll(): Promise<any[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 유저 조회' })
  @ApiParam({ name: 'id', type: 'number', description: '유저 ID' })
  @ApiResponse({ status: 200, description: '유저 조회 성공' })
  @ApiResponse({ status: 404, description: '유저를 찾을 수 없음' })
  @ApiResponse({ status: 400, description: '잘못된 ID 형식' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.usersService.findOne(id);
  }
}
