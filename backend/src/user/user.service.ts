import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateUserDto } from '@/user/user.dto'
import { hash } from 'argon2'

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {
	}

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				accounts: true
			}
		})

		if (!user)
			throw new NotFoundException('User not found')

		return user
	}

	public async findByEmail(email: string) {
		return await this.prismaService.user.findUnique({
			where: {
				email
			},
			include: {
				accounts: true
			}
		})
	}

	public async create(dto: CreateUserDto) {
		const user = await this.prismaService.user.create({
			data: {
				...dto,
				password: dto.password ? await hash(dto.password) : ''
			},
			include: {
				accounts: true
			}
		})

		return user
	}
}
