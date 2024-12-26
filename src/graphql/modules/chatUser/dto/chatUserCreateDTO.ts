import { IsNotEmpty } from 'class-validator';

export class ChatUserCreateDTO {
	@IsNotEmpty()
	chatId: number;
	@IsNotEmpty()
	userId: number;
	@IsNotEmpty()
	messageId: number;
}
