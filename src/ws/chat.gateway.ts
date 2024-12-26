import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/graphql/modules/auth/guards/ws-auth.guard';
import { ChatService } from 'src/graphql/modules/chat/chat.service';

import { MessageService } from 'src/graphql/modules/message/message.service';
import { User } from 'src/graphql/modules/user/user.entity';
import { IReadMessage, ISendMessage } from 'src/types/types';
import { Repository } from 'typeorm';
import { EVENTS } from './consts';

@WebSocketGateway(3001, {
	namespace: 'chat',
	cors: {
		origin: '*',
	},
})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private chatService: ChatService,
		private messageService: MessageService,
		@InjectRepository(User) private userRepository: Repository<User>,
	) {}

	@UseGuards(WsAuthGuard)
	handleConnection(client: Socket) {}
	handleDisconnect(client: any) {}
	@WebSocketServer() server: Server;

	afterInit(server: any) {
		console.log('io init');
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage(EVENTS.MESSAGE)
	public async handleSendMessage(@MessageBody() data: ISendMessage) {
		const message = await this.chatService.sendMessage(data);
		this.server.emit(EVENTS.MESSAGE, message);
		return message;
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage(EVENTS.READ_MESSAGE)
	public async handleReadMessage(@MessageBody() data: IReadMessage) {
		const message = await this.messageService.addReader(
			data.readerId,
			data.messageId,
		);
		this.server.emit(EVENTS.READ_MESSAGE, message);
		return message;
	}
}
