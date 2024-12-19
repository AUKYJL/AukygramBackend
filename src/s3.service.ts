import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import S3 = require('aws-sdk/clients/s3');

@Injectable()
export class S3Service {
  bucketName = '';
  private s3: S3;
  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('SELECTEL_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>(
        'SELECTEL_SECRET_ACCESS_KEY',
      ),
      endpoint: this.configService.get<string>('SELECTEL_ENDPOINT'),
      s3ForcePathStyle: true,
      region: 'ru-1a',
      apiVersion: 'latest',
    });

    this.bucketName = this.configService.get<string>('BUCKET_NAME');
  }
  public upload(file: any) {
    const key = Date.now().toString();
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
    };
    this.s3.upload(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
      }
    });
  }
  public getObject(params: any) {
    const url = this.s3.getSignedUrl('getObject', params);
    return { url };
  }
}
