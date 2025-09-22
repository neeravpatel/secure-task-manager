import { AuthUser } from "../interfaces/auth-user.interface";


export class AuthResponseDto {
  access_token!: string;
  user!: AuthUser;
}
