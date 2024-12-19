import { Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(of => User)
export class UserResolver {
	constructor(private userService: UserService) {}

	// @Mutation(returns => User)
	// createUser(@Args('registerData') registerData: RegisterInput) {
	// 	return this.userService.create(registerData);
	// }

	@Query(returns => [User])
	getUsers() {
		return this.userService.getUsers();
	}
}
