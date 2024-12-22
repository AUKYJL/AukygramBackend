import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as argon2 from 'argon2';
import { In, Repository } from 'typeorm';
import { RegisterDTO } from '../auth/dto/registerDTO';
import { Chat } from '../chat/chat.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Chat) private chatRepository: Repository<Chat>,
	) {}

	public async create(registerDTO: RegisterDTO) {
		registerDTO.password = await argon2.hash(registerDTO.password);
		const { repeatedPassword, ...user } = registerDTO;
		return await this.userRepository.save(user);
	}

	public async getUsers() {
		return await this.userRepository.find();
	}
	public async getUserChats(userId: number) {
		const { chatIds } = await this.userRepository.findOne({
			where: { id: userId },
		});
		const chats = await this.chatRepository.find({
			where: { id: In(chatIds) },
		});

		return chats;
	}
}
