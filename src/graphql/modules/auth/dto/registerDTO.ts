import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDTO {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	tagName: string;

	@IsNotEmpty()
	phone: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	password: string;

	@IsNotEmpty()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	repeatedPassword: string;
}
