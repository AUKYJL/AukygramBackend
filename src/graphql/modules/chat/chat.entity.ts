import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { Base } from '../shared/entities/base.entity';
import { ChatInfo } from '../shared/entities/chatInfo.entity';

@Entity()
export class Chat extends Base {
	@OneToOne(() => ChatInfo, { cascade: true })
	@JoinColumn()
	chatInfo: ChatInfo;

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
