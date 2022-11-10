import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/api', (req: Request, res: Response) => {
  res.json({ users: ['userOne', 'userTwo', 'userThree'] });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
