import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ICartItem, IProduct } from './utils/interface';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {}

  async getAll(request: Request) {
    let responseFromAll: IProduct[] | ICartItem[] | null;

    const method = request.method;

    const body =
      Object.keys(request.body).length === 0 || request.body === undefined
        ? null
        : { data: request.body };

    const recipientName = request.originalUrl.split('/')[1];

    const recipientURL = process.env[recipientName];

    let products: IProduct[] | null;

    if (recipientURL) {
      const response = this.httpService.axiosRef({
        method: method,
        url: `${recipientURL}${request.originalUrl}`,
        ...body,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { data } = await response;

      if (recipientName === 'products' && method === 'GET') {
        if (!products) {
          await this.cacheManager.set('products', data);

          products = data;
        } else {
          products = await this.cacheManager.get('products');
        }

        responseFromAll = products;
      }
      if (recipientName === 'profile') {
        responseFromAll = data;
      }

      return responseFromAll;
    } else {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }
  }
}
