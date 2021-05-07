import { Inject, Controller, Get, Req, Logger } from '@nestjs/common';
// import { Request } from 'express';

@Controller('api')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  // constructor(
  //   @Inject('DeployServiceI')
  //   private readonly deployService: DeployServiceI,
  //   @Inject('ProxyServiceI')
  //   private readonly proxyService: ProxyServiceI,
  //   @Inject('StateServiceI')
  //   private readonly stateService: StateServiceI,
  // ) {}

  @Get('test')
  async test(): Promise<{
    data?: any;
    error?: Error;
  }> {
    try {
      return {
        data: 'ok',
      };
    } catch (error) {
      this.logger.error(`Test error: "${error.message}"`);
      return { error };
    }
  }
}
