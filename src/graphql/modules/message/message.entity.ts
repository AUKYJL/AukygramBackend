import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../shared/entities/base.entity';
import { ChatInfo } from '../shared/entities/chatInfo.entity';
import { User } from '../user/user.entity';

@Entity()
export class Message extends Base {
	@ManyToOne(() => User)
	@JoinColumn()
	sendBy: User;

	@ManyToOne(() => ChatInfo, chat => chat.messages, { cascade: true })
	chatInfo: ChatInfo;

	// @OneToMany(() => User, user => user.readMessages, { nullable: true })
	// readedBy: User[];

	@Column({ nullable: true })
	text?: string;

	@Column('text', { default: [], array: true })
	urlToPhotos?: string[];

	@Column('text', { default: [], array: true })
	urlToFiles?: string[];

	@Column('text', { default: [], array: true })
	urlToVideos?: string[];
}
