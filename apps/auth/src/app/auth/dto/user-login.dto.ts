import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

@InputType()
export class UserLoginDto {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
