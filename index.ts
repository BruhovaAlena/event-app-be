import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(cors());
app.get('/api', (req: Request, res: Response) => {
  console.log('prisiel request');
  res.json({ users: ['userOne', 'userTwo', 'userThree'] });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
