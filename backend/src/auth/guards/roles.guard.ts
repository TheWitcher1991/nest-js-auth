import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '@/auth/decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {
	}


	public async canActivate(context: ExecutionContext) {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(
			ROLES_KEY, [
				context.getHandler(),
				context.getClass()
			],
		)
		const request = context.switchToHttp().getRequest()

		if (!roles) return true

		if (!roles.includes(request.user.role)) {
			throw new ForbiddenException('Forbidden')
		}

		return true
	}
}
