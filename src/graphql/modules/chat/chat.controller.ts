import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './dto/createChatDTO';

@Controller('chats')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get()
	getChats() {
		return this.chatService.getChats();
	}

	@Get(':chatId/messages')
	getChatMessages(@Param('chatId') id: string) {
		return this.chatService.getMessages(+id);
	}
	@Post()
	@UseGuards(JwtAuthGuard)
	createChat(@Body() dto: CreateChatDTO, @Req() req) {
		return this.chatService.create(req.user, dto);
	}
}
