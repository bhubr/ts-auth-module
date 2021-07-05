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

  it('POST / register returns user id', () => request(app)
    .post('/register')
    .send({ email: 'john@doe.com', password: 'john2021' })
    .expect(201)
    .then((res: request.Response) => {
      const { id, email } = res.body;
      assert.strictEqual(id, 1);
      assert.strictEqual(email, 'john@doe.com');
    }));

  it('POST / register returns 400 (missing email)', () => request(app)
    .post('/register')
    .send({})
    .expect(400)
    .then((res: request.Response) => {
      const { error } = res.body;
      assert.strictEqual(error, 'missing email');
    }));

  it('POST / register returns 400 (missing password)', () => request(app)
    .post('/register')
    .send({ email: 'john@doe.com' })
    .expect(400)
    .then((res: request.Response) => {
      const { error } = res.body;
      assert.strictEqual(error, 'missing password');
    }));

  it('POST / register returns 400 (password too short)', () => request(app)
    .post('/register')
    .send({ email: 'john@doe.com', password: 'abc' })
    .expect(400)
    .then((res: request.Response) => {
      const { error } = res.body;
      assert.strictEqual(error, 'password too short');
    }));

  it('POST / login returns 401 (invalid email)', () => request(app)
    .post('/login')
    .send({ email: 'john@dox.com', password: 'abcdefgh' })
    .expect(401)
    .then((res: request.Response) => {
      const { error } = res.body;
      assert.strictEqual(error, 'invalid email or password');
    }));

  it('POST / login returns 401 (invalid password)', () => request(app)
    .post('/login')
    .send({ email: 'john@doe.com', password: 'abcdefgh' })
    .expect(401)
    .then((res: request.Response) => {
      const { error } = res.body;
      assert.strictEqual(error, 'invalid email or password');
    }));

  it('POST / login returns 200 (ok)', () => {
    const cookieRe = /jwt=([0-9a-zA-Z\-._]+); Path=\//;
    return request(app)
      .post('/login')
      .send({ email: 'john@doe.com', password: 'john2021' })
      .expect(200)
      .then((res: request.Response) => {
        const { 'set-cookie': setCookie } = res.headers;
        assert.ok(Array.isArray(setCookie));
        const [jwtCookie] = setCookie;
        const matchRe = jwtCookie.match(cookieRe);
        assert.ok(matchRe !== null);
      });
  });
});
