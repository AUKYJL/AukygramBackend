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
	public async getUserChatsWithUnreadCount(userId: number) {
		const { chatIds } = await this.userRepository.findOne({
			where: { id: userId },
		});
		const chats = await this.chatRepository.find({
			where: { id: In(chatIds) },
			relations: {
				chatUsers: { user: true, chat: true },
				chatInfo: { messages: { sendBy: true } },
			},
			order: { chatInfo: { messages: { createdAt: 'DESC' } } },
		});
		console.log(
			'CHATID15 ',
			chats.filter(chat => chat.id === 15),
			chats.filter(chat => chat.id === 15)[0].chatUsers,
			chats
				.filter(chat => chat.id === 15)[0]
				.chatInfo.messages.sort((a, b) => b.id - a.id)
				.slice(0, 5),
		);
		console.log(
			chats.map(chat => {
				console.log(chat.id);
			}),
		);
		const unreadCount = chats.map(
			chat =>
				chat.chatInfo.messages.filter(message => {
					if (
						message.sendBy.id !== userId &&
						message.id >
							(chat.chatUsers.filter(
								chatUser =>
									chatUser.user.id === userId && chat.id === chatUser.chat.id,
							)[0].lastReadMessageId ?? 0)
					) {
						console.log('add unread');
						console.log(chat.id);
						console.log(message.id);
						console.log(
							chat.chatUsers.filter(
								chatUser =>
									chatUser.user.id === userId && chat.id === chatUser.chat.id,
							),
						);
					}
					return (
						message.sendBy.id !== userId &&
						message.id >
							(chat.chatUsers.filter(
								chatUser =>
									chatUser.user.id === userId && chat.id === chatUser.chat.id,
							)[0].lastReadMessageId ?? 0)
					);
				}).length,
		);
		//TODO: при прочтении юзер попадает в бд в мессега в readedBy и он типо его прочитал,
		//  но при этом не обновилось lastReadMessageId

		//и при последующих заходах на фронте он просто не попадает в mark as read потому что он есть в readedBy
		return { chats, unreadCount };
	}
}
