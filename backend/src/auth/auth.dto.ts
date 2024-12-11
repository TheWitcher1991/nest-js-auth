import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'
import { IsPasswordMatchConstraintDecorator } from '@/libs/decorators/is-password-match-constraint.decorator'

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Validate(IsPasswordMatchConstraintDecorator)
	passwordRepeat: string
}

export class LoginDto {
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string
}
