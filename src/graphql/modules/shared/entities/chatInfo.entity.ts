import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Message } from '../../message/message.entity';
import { Base } from './base.entity';

@Entity()
export class ChatInfo extends Base {
	@OneToMany(() => Message, message => message.chatInfo)
	@JoinColumn()
	messages: Message[];

	@Column('text', { default: [], array: true })
	urlToPhotos?: string[];

	@Column('text', { default: [], array: true })
	urlToFiles?: string[];

	@Column('text', { default: [], array: true })
	urlToVideos?: string[];

	@Column('text', { default: [], array: true })
	links?: string[];

	@Column('text', { default: [], array: true })
	urlToVoiceMessages?: string[];
}
