import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/user.entity';

export class CreateMessageDTO {
	@IsNotEmpty()
	sendBy: User;

	@IsNotEmpty()
	text: string;

	urlToPhotos?: string[];

	urlToFiles?: string[];

	urlToVideos?: string[];
}
