export interface User {
  id: number;
  username: string;
  nickname: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  userAccount?: UserAccount | null;
}

export interface UserAccount {
  id: number;
  userId: number;
  email: string;
  password: string | null;
  provider: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User | null;
}
