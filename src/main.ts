import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	const config = await app.get(ConfigService);
	const port = config.get<number>('API_PORT');
	app.setGlobalPrefix('api');
	app.enableCors({});

	await app.listen(port || 3000, () => {
		console.log(`App started on port: ${port}`);
	});
}
bootstrap();
