import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateMessageDTO } from './dto/createMessageDTO';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message) private messageRepository: Repository<Message>,
		@InjectRepository(User) private userRepository: Repository<User>,
	) {}

	public async createMessage(createMessageData: CreateMessageDTO) {
		const message = await this.messageRepository.create(createMessageData);
		return await this.messageRepository.save(message);
	}

	public async getMessages() {
		return await this.messageRepository.find();
	}

	public async getMessageById(id: number) {
		const message = await this.messageRepository.findOne({
			where: { id },
			relations: { sendBy: true, readedBy: true },
		});
		if (!message)
			throw new NotFoundException(`Message with ${id} id doesnt exists`);
		return message;
	}

	public async getSendBy(message: Message) {
		const msg = await this.messageRepository.findOne({
			where: { id: message.id },
			relations: { sendBy: true },
		});
		return msg.sendBy;
	}

	public async addReader(userId: number, messageId: number) {
		const message = await this.messageRepository.findOne({
			where: { id: messageId },
			relations: { readedBy: true },
		});
		const user = await this.userRepository.findOne({
			where: { id: userId },
		});

		if (message.readedBy.some(user => user.id === userId)) return message;

		message.readedBy.push(user);
		return await this.messageRepository.save(message);
	}

	public async updateMessageById(id: number) {
		// const message = await this.messageRepository.find({ where: { id } });
		// if (!message)
		//   throw new NotFoundException(`Message with ${id} id doesnt exists`);
		// return await this.messageRepository.update();
	}

	public async deleteMessageById(id: number) {
		//self deleting
		//admin deleting
	}
}
