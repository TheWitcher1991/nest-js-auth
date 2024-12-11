import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { LoginDto, RegisterDto } from '@/auth/auth.dto'
import { UserService } from '@/user/user.service'
import { Request, Response } from 'express'
import { verify } from 'argon2'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService,
				private readonly configService: ConfigService) {
	}

	public async register(req: Request, dto: RegisterDto) {
		const isExist = await this.userService.findByEmail(dto.email)

		if (isExist) {
			throw new ConflictException('Email already exists')
		}

		const newUser = await this.userService.create({
			email: dto.email,
			fullName: dto.name,
			password: dto.password,
			picture: '',
			method: 'CREDENTIALS',
			isVerified: false,
		})

		return await this.saveSession(req, user)
	}

	public async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user || !user.password) {
			throw new NotFoundException('User not found')
		}

		const isValidPassword = await verify(user.password, dto.password)

		if (!isValidPassword) {
			throw new UnauthorizedException('Invalid password')
		}

		return await this.saveSession(req, user)
	}

	public async logout(req: Request, res: Response) {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException('Failed to destroy session'),
					)
				}
				res.clearCookie(this.configService.get('SESSION_NAME'))
				resolve()
			})
		})
	}

	private async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException('Failed to save session'),
					)
				}

				resolve({
					user,
				})
			})
		})
	}
}
