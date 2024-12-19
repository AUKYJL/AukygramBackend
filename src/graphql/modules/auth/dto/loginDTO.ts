import { IsEmail, IsNotEmpty, MinLength, ValidateIf } from 'class-validator';

export class LoginDTO {
	tagName?: string;

	phone?: string;

	@ValidateIf(o => o.email !== undefined)
	@IsEmail()
	email?: string;

	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	@IsNotEmpty()
	password: string;
}
