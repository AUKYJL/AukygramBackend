import { Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private s3Service: S3Service,
    private configService: ConfigService,
  ) {}
}
