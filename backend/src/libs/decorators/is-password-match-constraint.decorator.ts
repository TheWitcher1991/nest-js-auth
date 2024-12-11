import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator'
import { RegisterDto } from '@/auth/auth.dto'

export class IsPasswordMatchConstraintDecorator implements ValidatorConstraintInterface {
	public validate(passwordRepeat: string, args: ValidationArguments): boolean {
		const obj = args.object as RegisterDto
		return obj.password === passwordRepeat
	}

	public defaultMessage(args?: ValidationArguments): string {
		return 'Passwords do not match'
	}
}
