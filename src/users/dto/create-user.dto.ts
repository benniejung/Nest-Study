export class CreateUserDto {
  username: string;
  nickname: string;
  profileImage?: string;
  email: string;
  password?: string;
  provider?: number; // 0: 일반계정, 1: 카카오 계정
}
