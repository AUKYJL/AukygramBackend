import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/graphql/modules/chat/chat.entity';
import { ChatService } from 'src/graphql/modules/chat/chat.service';
import { ChatUser } from 'src/graphql/modules/chatUser/chatUser.entity';
import { ChatUserService } from 'src/graphql/modules/chatUser/chatUser.service';
import { MessageModule } from 'src/graphql/modules/message/message.module';
import { User } from 'src/graphql/modules/user/user.entity';
import { UserService } from 'src/graphql/modules/user/user.service';
import { ChatGateway } from './chat.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([Chat, User, ChatUser]), MessageModule],
	providers: [ChatGateway, ChatService, ChatUserService, UserService],
})
export class WSChatModule {}
