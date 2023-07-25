import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Access, Auth } from 'src/accounts/auth/auth.decorator';

@Auth(Access.Public)
@Controller()
export class SystemController {
  @Get('/app/health')
  health(@Res() res: Response) {
    res.json({ status: 'ok' });
  }
}
