import {
  All,
  CacheInterceptor,
  Controller,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('*')
  async getAll(@Req() request: Request) {
    if (request.originalUrl === '/favico.ico') {
      return { status: 'OK' };
    } else {
      return this.appService.getAll(request);
    }
  }
}
