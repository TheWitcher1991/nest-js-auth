import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import IORedis from 'ioredis'
import * as session from 'express-session'
import ms from 'ms'
import { parseBoolean } from '@/utils/parse-boolean.util'
import { RedisStore } from 'connect-redis'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const redis = new IORedis(config.getOrThrow<string>('REDIS_URI'))

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	)

	app.use(session({
		secret: config.getOrThrow<string>('SESSION_SECRET'),
		name: config.getOrThrow<string>('SESSION_NAME'),
		resave: true,
		saveUninitialized: false,
		cookie: {
			domain: config.getOrThrow<string>('SESSION_DOMAIN'),
			maxAge: ms(config.getOrThrow<string>('SESSION_MAX_AGE')),
			httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
			secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
			sameSite: 'lax',
		},
		store: new RedisStore({
			client: redis,
			prefix: config.getOrThrow<string>('SESSION_FOLDER'),
		}),
	}))

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie'],
	})

	await app.listen(config.getOrThrow<number>('APP_PORT'))
}

bootstrap()