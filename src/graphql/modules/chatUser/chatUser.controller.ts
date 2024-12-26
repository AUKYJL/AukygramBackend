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
import { ChatUserService } from './chatUser.service';
import { ChatUserCreateDTO } from './dto/chatUserCreateDTO';

@Controller('chatUsers')
export class ChatUserController {
	constructor(private readonly chatUserService: ChatUserService) {}

	@Post('/lastReadedMessageId')
	setLastReadedMessageId(@Body() dto: ChatUserCreateDTO) {
		return this.chatUserService.setLastReadedMessageId(dto);
	}

	@Get('/lastReadedMessageIds')
	@UseGuards(JwtAuthGuard)
	getLastReadedMessageIds(@Req() req) {
		return this.chatUserService.getLastReadedMessageIds(+req.user.id);
	}

	@Get('/lastReadedMessageId/:chatId')
	@UseGuards(JwtAuthGuard)
	getLastReadedMessageId(@Req() req, @Param('chatId') chatId) {
		return this.chatUserService.getLastReadedMessageId(+req.user.id, +chatId);
	}

	// @Get("undreadedCount")
	//TODO:получить сооб у которых айди больше ластрида и .length = колво непрочитанных
}
