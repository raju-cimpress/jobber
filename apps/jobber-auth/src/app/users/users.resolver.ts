import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGaurd } from '../auth/gaurds/graphql-auth.gaurd';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  @UseGuards(GraphqlAuthGaurd)
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GraphqlAuthGaurd)
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserDto) {
    return this.usersService.createUser(createUserInput);
  }
}
