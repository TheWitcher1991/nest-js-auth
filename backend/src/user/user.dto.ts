import { IsBoolean, IsEmail, IsString } from 'class-validator'

export interface CreateUserDto {
	@IsEmail()
	email: string

	@IsString()
	password: string

	@IsString()
	fullName: string

	@IsString()
	picture: string
	method: string

	@IsBoolean()
	isVerified: boolean
}
