import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';

import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/loginDTO';
import { RegisterDTO } from './dto/registerDTO';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private configService: ConfigService,
		@InjectRepository(User) private userRepository: Repository<User>,
	) {}

	async validateUser(
		tagName: string,
		phone: string,
		email: string,
		password: string,
	): Promise<any> {
		const user = await this.userRepository.findOne({
			where: [{ email }, { phone }, { tagName }],
		});
		const passwordIsMatch = await argon2.verify(user.password, password);
		if (user && passwordIsMatch) {
			return user;
		}
		throw new NotFoundException('user or password are incorrect');
	}

	public async login(loginDTO: LoginDTO, res: Response) {
		const { tagName, phone, email, password } = loginDTO;

		//can get only one field at the same time and password
		let user: User = null;
		if (phone) {
			user = await this.userRepository.findOne({
				where: { phone },
			});
		} else if (email) {
			user = await this.userRepository.findOne({
				where: { email },
			});
		} else if (tagName) {
			user = await this.userRepository.findOne({
				where: { tagName },
			});
		}

		if (!user) {
			throw new NotFoundException('user is incorrect');
		}
		user = await this.validateUser(
			user.tagName,
			user.phone,
			user.email,
			password,
		);
		return this.generateDataToFront(user, res);
	}
	public logout(res: Response) {
		res.clearCookie('refreshToken', {
			httpOnly: true,
			sameSite: 'strict',
		});

		return res.json({ message: 'Successfully logged out' });
	}
	private async generateDataToFront(user: User, res: Response) {
		const { accessToken, refreshToken } = this.generateTokens(
			user.id,
			user.tagName,
		);
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});
		return res.json({
			accessToken,
			id: user.id,
			tagName: user.tagName,
		});
	}
	public generateTokens(id: number, tagName: string) {
		const payload = { id, tagName };
		const accessToken = this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_ACCESS_SECRET'),
			expiresIn: '1d',
		});
		const refreshToken = this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_REFRESH_SECRET'),
			expiresIn: '30d',
		});
		return { accessToken, refreshToken };
	}

	public async refreshTokens(req: Request, res: Response) {
		const refreshToken = req.cookies?.refreshToken;

		if (!refreshToken) {
			throw new UnauthorizedException('Refresh token not provided');
		}

		try {
			const payload = this.jwtService.verify(refreshToken, {
				secret: this.configService.get('JWT_REFRESH_SECRET'),
			});

			const user = await this.userRepository.findOne({
				where: { id: payload.id },
			});
			if (!user) {
				throw new UnauthorizedException('User not found');
			}

			return this.generateDataToFront(user, res);
		} catch (error) {
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	public async validateRefreshToken(refreshToken: string) {
		try {
			return this.jwtService.verify(refreshToken, {
				secret: process.env.JWT_REFRESH_SECRET,
			});
		} catch (e) {
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	public async register(registerDTO: RegisterDTO, res: Response) {
		if (registerDTO.password !== registerDTO.repeatedPassword) {
			throw new BadRequestException('Passwords must be the same');
		}

		const isUserExists = await this.userRepository.findOne({
			where: [
				{ tagName: registerDTO.tagName },
				{ phone: registerDTO.phone },
				{ email: registerDTO.email },
			],
		});
		if (isUserExists) {
			if (isUserExists.tagName === registerDTO.tagName) {
				throw new BadRequestException(
					'This tag name already exists, try to login or use another tag name',
				);
			} else if (isUserExists.phone === registerDTO.phone) {
				throw new BadRequestException(
					'This phone number already exists, try to login or use another phone number',
				);
			} else {
				throw new BadRequestException(
					'This email already exists, try to login or use another email',
				);
			}
		}

		const user = await this.userService.create(registerDTO);
		return this.generateDataToFront(user, res);
	}
}
