import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './AppController';


describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', async () => {
      const appController = app.get<AppController>(AppController);
      // const deployService = app.get<TestDeployService>('DeployServiceI');
      // spyOn(deployService, 'createCluster').and.returnValue(
      //   Promise.resolve('Hello World!'),
      // );
      expect(await appController.test()).toBe('Hello World!');
    });
  });
});
