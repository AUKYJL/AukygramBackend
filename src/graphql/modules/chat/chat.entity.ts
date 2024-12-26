import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { ChatUser } from '../chatUser/chatUser.entity';
import { Base } from '../shared/entities/base.entity';
import { ChatInfo } from '../shared/entities/chatInfo.entity';

@Entity()
export class Chat extends Base {
	@OneToOne(() => ChatInfo, { cascade: true })
	@JoinColumn()
	chatInfo: ChatInfo;

	@OneToMany(() => ChatUser, chatUser => chatUser.chat)
	chatUsers: ChatUser[];

	@Column('int', { array: true, default: [] })
	memberIds: number[];

	@Column('int', { array: true, default: [] })
	adminIds: number[];

	@Column()
	tagName: string;

	@Column()
	name: string;
	//notifications
}
