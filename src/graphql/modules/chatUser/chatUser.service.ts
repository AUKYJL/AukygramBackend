import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ChatUser } from './chatUser.entity';
import { ChatUserCreateDTO } from './dto/chatUserCreateDTO';

@Injectable()
export class ChatUserService {
	constructor(
		@InjectRepository(ChatUser)
		private chatUserRepository: Repository<ChatUser>,
		private readonly userService: UserService,
	) {}

	public async setLastReadedMessageId(dto: ChatUserCreateDTO) {
		const chatUser = await this.chatUserRepository.create({
			user: { id: dto.userId },
			chat: { id: dto.chatId },
			lastReadMessageId: dto.messageId,
		});
		return await this.chatUserRepository.save(chatUser);
	}
	public async getLastReadedMessageIds(userId: number) {
		const { chats } =
			await this.userService.getUserChatsWithUnreadCount(userId);
		const chatUsers = await this.chatUserRepository.find({
			where: {
				chat: { id: In(chats.map(chat => chat.id)) },
				user: { id: userId },
			},
			relations: { chat: true },
			order: { lastReadMessageId: 'DESC' },
		});
		return chatUsers;
	}
	public async getLastReadedMessageId(userId: number, chatId: number) {
		const chatUser = await this.chatUserRepository.findOne({
			where: { user: { id: userId }, chat: { id: chatId } },
		});
		return chatUser.lastReadMessageId;
	}
}
