import { Context, Get, HttpResponseOK, dependency } from '@foal/core';
import { SocketHandler } from '../services';

export class SockettestController {
  @dependency
  socket : SocketHandler
  @Get('/')
  foo(ctx: Context) {
    return new HttpResponseOK();
  }

}
