import {
	Body,
	Controller,
	Get,
	Post,
	Request,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/loginDTO';
import { RegisterDTO } from './dto/registerDTO';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@UsePipes(new ValidationPipe())
	async login(@Body() dto: LoginDTO) {
		return this.authService.login(dto);
	}
	@Post('register')
	@UsePipes(new ValidationPipe())
	async register(@Body() dto: RegisterDTO) {
		return this.authService.register(dto);
	}
	@Post('refresh')
	async refresh(@Body() { refreshToken }: { refreshToken: string }) {
		const payload = await this.authService.validateRefreshToken(refreshToken);
		return this.authService.generateTokens(payload.id, payload.tagName);
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	getProfile(@Request() req) {
		return req.user;
	}
}
