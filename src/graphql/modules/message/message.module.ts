import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Module({
	imports: [TypeOrmModule.forFeature([Message, User])],
	providers: [MessageService],
	exports: [MessageService],
})
export class MessageModule {}
