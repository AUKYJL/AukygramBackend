import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/loginDTO';
import { RegisterDTO } from './dto/registerDTO';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@UsePipes(new ValidationPipe())
	async login(@Body() dto: LoginDTO, @Res() res: Response) {
		return this.authService.login(dto, res);
	}
	@Post('logout')
	logout(@Res() res: Response) {
		return this.authService.logout(res);
	}
	@Post('register')
	@UsePipes(new ValidationPipe())
	async register(@Body() dto: RegisterDTO, @Res() res: Response) {
		return this.authService.register(dto, res);
	}
	@Post('refresh')
	async refresh(@Req() req: Request, @Res() res: Response) {
		return this.authService.refreshTokens(req, res);
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	getProfile(@Req() req) {
		return req.user;
	}
}
