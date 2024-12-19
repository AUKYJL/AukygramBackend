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

import { User } from 'src/graphql/modules/user/user.entity';
import { ISendMessage } from 'src/types/types';
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
	async handleSendMessage(@MessageBody() data: ISendMessage) {
		this.server.emit(EVENTS.MESSAGE, data);
		this.chatService.sendMessage(data);
		return data;
	}
}
