import * as assert from 'assert';
import * as request from 'supertest';
import app from '../src/app';

describe('test app routes', () => {
  it('GET / sends message yo', () => request(app)
    .get('/')
    .expect(200)
    .then((res: request.Response) => {
      const { message } = res.body;
      assert.strictEqual(message, 'yo');
    }));
});
