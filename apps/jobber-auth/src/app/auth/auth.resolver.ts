import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../users/models/user.model';
import { UserLoginDto } from './dto/user-login.dto';
import { GraphqlContext } from '@jobber/nestjs';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async login(
    @Args('loginInput') loginInput: UserLoginDto,
    @Context() context: GraphqlContext
  ): Promise<User> {
    return this.authService.login(loginInput, context.res);
  }
}
