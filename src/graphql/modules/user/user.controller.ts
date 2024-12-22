import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	getUsers() {
		return this.userService.getUsers();
	}

	@Get('ownChats')
	@UseGuards(JwtAuthGuard)
	getUserChats(@Req() req) {
		return this.userService.getUserChats(+req.user.id);
	}
}
