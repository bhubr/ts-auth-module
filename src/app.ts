import * as express from 'express';
import * as bcrypt from 'bcrypt';

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

export default app;
