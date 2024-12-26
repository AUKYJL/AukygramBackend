import { Column, Entity, ManyToOne } from 'typeorm';
import { Chat } from '../chat/chat.entity';
import { Base } from '../shared/entities/base.entity';
import { User } from '../user/user.entity';

@Entity()
export class ChatUser extends Base {
	@ManyToOne(() => User, user => user.chatUsers)
	user: User;

	@ManyToOne(() => Chat, chat => chat.chatUsers)
	chat: Chat;

	@Column({ nullable: true })
	lastReadMessageId: number;
}
