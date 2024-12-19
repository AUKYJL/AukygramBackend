import { IsNotEmpty } from 'class-validator';

export class CreateChatDTO {
	startMembersIds?: number[];

	@IsNotEmpty()
	tagName: string;

	@IsNotEmpty()
	name: string;
}
