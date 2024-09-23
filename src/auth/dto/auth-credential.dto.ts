import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthCredentialDto {
  @IsEmail()
  @IsNotEmpty()
  mail: string;
  @IsEmail()
  @IsNotEmpty()
  password: string;
}
