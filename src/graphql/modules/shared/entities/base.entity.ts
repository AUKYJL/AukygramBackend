import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Base {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ default: () => 'NOW()' })
	createdAt: Date;

	@UpdateDateColumn({ default: () => 'NOW()' })
	updatedAt: Date;
}
