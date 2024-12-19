import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { S3Service } from './s3.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly s3Service: S3Service,
	) {}

	@Post('file')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log(file);
		return this.s3Service.upload(file);
	}

	// @Get(':fileName')
	// test2(@Param('fileName') filename: string) {
	//   this.appService.test2(filename);
	// }
}
