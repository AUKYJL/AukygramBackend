import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from '../message/message.entity';
import { MessageService } from '../message/message.service';
import { User } from '../user/user.entity';
import { ChatController } from './chat.controller';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';

@Module({
	imports: [TypeOrmModule.forFeature([Chat, Message, User])],
	controllers: [ChatController],
	providers: [ChatService, MessageService],
})
export class ChatModule {}
