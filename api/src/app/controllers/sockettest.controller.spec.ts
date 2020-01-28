// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { SockettestController } from './sockettest.controller';

describe('SockettestController', () => {

  let controller: SockettestController;

  beforeEach(() => controller = createController(SockettestController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(SockettestController, 'foo'), 'GET');
      strictEqual(getPath(SockettestController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
