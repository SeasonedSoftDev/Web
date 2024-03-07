import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './core/auth/decorators/public.decorator';
// import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('c/:trackingCode')
  @ApiOperation({
    summary: 'Track a campaign code',
    description: 'Redirects to /campaign/track route.',
  })
  @ApiTags('campaign')
  trackCampaign(@Param('trackingCode') code: string, @Res() res: Response) {
    return res.redirect(`/campaign/track/?c=${code}`);
  }

  @Get('ping')
  @Public()
  // @SkipThrottle(true)
  ping(): string | number {
    return this.appService.ping();
  }

  @Get('pingAuth')
  // @SkipThrottle(true)
  pingAuth() {
    return { ping: 'pong' };
  }
}
