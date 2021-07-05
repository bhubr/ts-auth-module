import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

const app: express.Application = express();

app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
  res.send({ message: 'yo' });
});

interface RetNumber {
  (): Number;
}
const genId: RetNumber = (() => {
  let number = 0;
  return (): Number => {
    number += 1;
    return number;
  };
})();

const users = [];

app.post('/register', async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || email.length === 0) {
    return res.status(400).send({ error: 'missing email' });
  }
  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).send({ error: 'missing password' });
  }
  if (password.length < 8) {
    return res.status(400).send({ error: 'password too short' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = {
    id: genId(),
    email,
    password: hashedPassword,
  };
  users.push(user);
  return res.status(201).send({
    id: user.id,
    email: user.email,
  });
});

app.post('/login', async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || email.length === 0) {
    return res.status(400).send({ error: 'missing email' });
  }
  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).send({ error: 'missing password' });
  }
  if (password.length < 8) {
    return res.status(400).send({ error: 'password too short' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).send({
      error: 'invalid email or password',
    });
  }
  const pwdDoesMatch = await bcrypt.compare(password, user.password);
  if (!pwdDoesMatch) {
    return res.status(401).send({
      error: 'invalid email or password',
    });
  }
  const jwt = await sign({ userId: user.id }, 'shhhhh');
  return res.cookie('jwt', jwt).sendStatus(200);
});

export default app;
