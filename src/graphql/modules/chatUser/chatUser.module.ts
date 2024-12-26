import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../chat/chat.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ChatUserController } from './chatUser.controller';
import { ChatUser } from './chatUser.entity';
import { ChatUserService } from './chatUser.service';

@Module({
	imports: [TypeOrmModule.forFeature([ChatUser, User, Chat])],
	controllers: [ChatUserController],
	providers: [ChatUserService, UserService],
})
export class ChatUserModule {}
