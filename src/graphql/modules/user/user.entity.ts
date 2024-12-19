import { Column, Entity, ManyToMany } from 'typeorm';

import { Base } from '../shared/entities/base.entity';
import { Friend } from '../shared/entities/friend.entity';

@Entity()
export class User extends Base {
	@Column('int', { array: true, default: [] })
	chatIds: number[];

	@ManyToMany(() => Friend, friend => friend.user)
	friends: Friend[];
	//   folders:

	@Column()
	name: string;

	@Column()
	tagName: string;
	@Column()
	phone: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ nullable: true })
	bio?: string;

	@Column('text', { nullable: true })
	urlToAvatar?: string;

	@Column({ type: 'timestamptz', default: () => 'NOW()' })
	lastSeenAt: Date;

	@Column({ default: true })
	online: boolean;
}
