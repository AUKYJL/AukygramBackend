import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { RegisterDTO } from '../auth/dto/registerDTO';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
	) {}

	public async create(registerDTO: RegisterDTO) {
		registerDTO.password = await argon2.hash(registerDTO.password);
		const { repeatedPassword, ...user } = registerDTO;
		return await this.userRepository.save(user);
	}

	public async getUsers() {
		return await this.userRepository.find();
	}
}
