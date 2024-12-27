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
		const existingChatUser = await this.chatUserRepository.findOne({
			where: {
				user: { id: dto.userId },
				chat: { id: dto.chatId },
			},
		});

		if (existingChatUser) {
			console.log(existingChatUser, dto);
			if (dto.messageId > existingChatUser.lastReadMessageId)
				existingChatUser.lastReadMessageId = dto.messageId;
			return await this.chatUserRepository.save(existingChatUser);
		} else {
			const newChatUser = this.chatUserRepository.create({
				user: { id: dto.userId },
				chat: { id: dto.chatId },
				lastReadMessageId: dto.messageId,
			});
			return await this.chatUserRepository.save(newChatUser);
		}
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
