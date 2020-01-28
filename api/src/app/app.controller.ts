import { controller, dependency } from '@foal/core';

import { ApiController, SockettestController } from './controllers';
import { SocketHandler } from './services';
import { listenerCount } from 'cluster';

export class AppController {
  subControllers = [
    controller('/demo', ApiController),
    controller('/demo2', SockettestController),
  ];
}
