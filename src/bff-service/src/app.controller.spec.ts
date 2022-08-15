import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Request } from 'express';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('all pathes', () => {
    const request: Request | null = null;

    it('should return object with products or cart or null if not correct path', () => {
      expect(appController.getAll(request)).toBe(null);
    });
  });
});
