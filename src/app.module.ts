import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/config';
import { S3Service } from './s3.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './graphql/modules/auth/auth.module';
import { ChatModule } from './graphql/modules/chat/chat.module';
import { MessageModule } from './graphql/modules/message/message.module';
import { UserModule } from './graphql/modules/user/user.module';
import { WSChatModule } from './ws/wsChat.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [config],
		}),

		// GraphQLModule.forRoot<ApolloDriverConfig>({
		// 	driver: ApolloDriver,
		// 	autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
		// 	playground: true,
		// 	sortSchema: true,
		// }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				// type: configService.get<''>('TYPEORM_CONNECTION'),
				type: 'postgres',
				host: configService.get('TYPEORM_HOST'),
				port: configService.get('TYPEORM_PORT'),
				username: configService.get('TYPEORM_USERNAME'),
				password: configService.get('TYPEORM_PASSWORD'),
				database: configService.get('TYPEORM_DATABASE'),
				entities: [__dirname + '/**/*.entity{.js, .ts}'],
				synchronize: true,
				autoLoadEntities: true,
				logging: true,
			}),
		}),
		MessageModule,
		UserModule,
		AuthModule,
		ChatModule,
		WSChatModule,
	],
	controllers: [AppController],
	providers: [AppService, S3Service],
})
export class AppModule {}
