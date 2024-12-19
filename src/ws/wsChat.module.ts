import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/graphql/modules/chat/chat.entity';
import { ChatService } from 'src/graphql/modules/chat/chat.service';
import { MessageModule } from 'src/graphql/modules/message/message.module';
import { User } from 'src/graphql/modules/user/user.entity';
import { ChatGateway } from './chat.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([Chat, User]), MessageModule],
	providers: [ChatGateway, ChatService],
})
export class WSChatModule {}
