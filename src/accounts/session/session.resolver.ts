import { Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/accounts/auth/auth.service';

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly authService: AuthService) {}

}
