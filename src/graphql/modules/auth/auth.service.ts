import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';

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
		throw new UnauthorizedException('user or password are incorrect');
	}

	public async login(loginDTO: LoginDTO) {
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
			throw new UnauthorizedException('user or password are incorrect');
		}
		return this.generateDataToFront(user);
	}
	private generateDataToFront(user: User) {
		return {
			token: this.jwtService.sign({ id: user.id, tagName: user.tagName }),
			user,
		};
	}

	public async register(registerDTO: RegisterDTO) {
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
		return this.generateDataToFront(user);
	}
}
