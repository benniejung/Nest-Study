import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '사용자 이름', example: 'testuser' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '닉네임', example: '테스트유저' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiProperty({ description: '이메일', example: 'test@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '비밀번호 (소셜 로그인인 경우 선택)',
    example: 'password123',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: '로그인 제공자 (0: 일반계정, 1: 카카오 계정)',
    example: 0,
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  provider?: number;
}
