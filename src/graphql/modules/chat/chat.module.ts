import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatUser } from '../chatUser/chatUser.entity';
import { ChatUserService } from '../chatUser/chatUser.service';
import { Message } from '../message/message.entity';
import { MessageService } from '../message/message.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ChatController } from './chat.controller';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';

@Module({
	imports: [TypeOrmModule.forFeature([Chat, Message, User, ChatUser])],
	controllers: [ChatController],
	providers: [ChatService, MessageService, ChatUserService, UserService],
})
export class ChatModule {}
