import { Entity, JoinColumn, OneToOne } from 'typeorm';

import { User } from '../../user/user.entity';
import { Base } from './base.entity';
import { ChatInfo } from './chatInfo.entity';

@Entity()
export class Friend extends Base {
	@OneToOne(() => User)
	@JoinColumn()
	user: User;

	@OneToOne(() => ChatInfo, { cascade: true })
	@JoinColumn()
	chatInfo: ChatInfo;

	//notification
	//common chats
	//is blocked u
}
