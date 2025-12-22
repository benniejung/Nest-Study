import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '사용자 이름', example: 'testuser' })
  username: string;

  @ApiProperty({ description: '닉네임', example: '테스트유저' })
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  profileImage?: string;

  @ApiProperty({ description: '이메일', example: 'test@example.com' })
  email: string;

  @ApiProperty({
    description: '비밀번호 (소셜 로그인인 경우 선택)',
    example: 'password123',
    required: false,
  })
  password?: string;

  @ApiProperty({
    description: '로그인 제공자 (0: 일반계정, 1: 카카오 계정)',
    example: 0,
    required: false,
    default: 0,
  })
  provider?: number;
}
