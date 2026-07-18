import { IsEmpty, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email should not be provided' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
