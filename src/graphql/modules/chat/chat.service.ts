import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ISendMessage, IUserFrontendData } from 'src/types/types';

import { In, Repository } from 'typeorm';
import { MessageService } from '../message/message.service';
import { ChatInfo } from '../shared/entities/chatInfo.entity';
import { User } from '../user/user.entity';
import { Chat } from './chat.entity';
import { CreateChatDTO } from './dto/createChatDTO';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat) private chatRepository: Repository<Chat>,
		@InjectRepository(User) private userRepository: Repository<User>,
		private messageService: MessageService,
	) {}

	public async create(me: IUserFrontendData, dto: CreateChatDTO) {
		const isExists = await this.chatRepository.findOne({
			where: { tagName: dto.tagName },
		});

		if (isExists) {
			throw new BadRequestException('Chat with this tag name already exists');
		}
		const chat = await this.chatRepository.create({
			tagName: dto.tagName,
			name: dto.name,
			chatInfo: new ChatInfo(),
		});
		const members = [...(dto.startMembersIds ?? []), me.id];
		const admins = [me.id];
		chat.memberIds = members;
		chat.adminIds = admins;

		const createdChat = await this.chatRepository.save(chat);
		await this.addChatForUsers(createdChat.id, members);

		return createdChat;
	}
	private async addChatForUsers(chatId: number, userIds: number[]) {
		const users = await this.userRepository.find({
			where: { id: In(userIds) },
		});
		for (const user of users) {
			user.chatIds.push(chatId);
			await this.userRepository.save(user);
		}
	}

	public async getChats() {
		return await this.chatRepository.find();
	}

	public async getMessages(chatId: number) {
		const chat = await this.chatRepository.findOne({
			where: { id: chatId },
			relations: { chatInfo: { messages: { sendBy: true, readedBy: true } } },
		});
		return chat.chatInfo.messages;
	}

	public async sendMessage(data: ISendMessage) {
		const chat = await this.chatRepository.findOne({
			where: { id: data.chatId },
			relations: { chatInfo: { messages: true } },
		});
		if (!chat) {
			throw new BadRequestException('Chat not found');
		}
		const sender = await this.userRepository.findOne({
			where: { id: data.senderId },
		});
		if (!sender) {
			throw new BadRequestException('Sender not found');
		}

		const message = await this.messageService.createMessage({
			text: data.message,
			sendBy: sender,
		});

		chat.chatInfo.messages.push(message);

		return await this.chatRepository.save(chat);
	}
}
