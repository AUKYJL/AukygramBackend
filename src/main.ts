import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.use(cookieParser());
	const config = await app.get(ConfigService);
	const port = config.get<number>('API_PORT');
	app.setGlobalPrefix('api');

	app.enableCors({
		origin: 'http://localhost:3000',
		credentials: true,
	});

	await app.listen(port || 3000, () => {
		console.log(`App started on port: ${port}`);
	});
}
bootstrap();
