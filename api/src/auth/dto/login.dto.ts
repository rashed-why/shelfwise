import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class loginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
